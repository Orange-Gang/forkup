import { prisma_client } from '$lib/prisma';

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
		const content = form.get('content');
		const session = await locals.auth?.validate();
		const user = session?.user;

		// validate session & form inputs (zod, valibot, trpc???)

		const new_post = await prisma_client.post.create({
			data: {
				content,
				author: { connect: { id: user.userId } }
			}
		});

		// if !new_post, throw fail "Cannot post at this time"
	}
};
