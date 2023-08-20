import { prisma_client } from '$lib/prisma';
import { error } from '@sveltejs/kit';

export async function load() {
	const firehose = await prisma_client.post.findMany({
		take: 10,
		include: { author: true },
		orderBy: { createdAt: 'desc' }
	});

	return { firehose };
}

export const actions = {
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
	}
};
