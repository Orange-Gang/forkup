import { prisma_client } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const logged_user = session?.user;

	let blocked_user_ids: string[] = [];
	if (logged_user) {
		const blocked_users = await prisma_client.blocked.findMany({
			where: { OR: [{ blockedById: logged_user.id }, { blockedUserId: logged_user.id }] },
			select: { blockedById: true, blockedUserId: true }
		});
		blocked_user_ids = blocked_users.flatMap((b) => [b.blockedById, b.blockedUserId]);
	}

	const firehose = await prisma_client.post.findMany({
		take: 10,
		include: { author: true },
		orderBy: { createdAt: 'desc' },
		where: { author: { NOT: { id: { in: blocked_user_ids } } } }
	});

	return { firehose };
};
export const actions: Actions = {
	createPost: async ({ locals, request }) => {
		const form = await request.formData();
		const content = form.get('content') as string;
		const session = await locals.auth?.validate();
		const user = session?.user;

		// validate session & form inputs (zod, valibot, trpc???)

		if (!content || !user) {
			throw error(400, 'Bad request');
		}

		await prisma_client.post.create({
			data: {
				content,
				author: { connect: { id: user.userId } }
			}
		});

		// if !new_post, throw fail "Cannot post at this time"
	},
	deletePost: async ({ request }) => {
		const form = await request.formData();
		const post_id = form.get('id') as string;

		if (!post_id) {
			throw error(400, 'Bad request');
		}

		await prisma_client.post.delete({
			where: { id: post_id }
		});
	}
};
