import { prisma_client } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({locals}) => {
  const session = await locals.auth?.validate();
  const user = session?.user;

  if (!user) {

	const firehose = await prisma_client.post.findMany({
		take: 10,
		include: { author: true },
		orderBy: { createdAt: 'desc' }
	});
    return { firehose }
  }

  const firehose = await prisma_client.user.findUnique({
    where: {
      id: user?.userId,
    },
    select: {
      posts: {
        include: {
          author: true
        }
      },
    },
  })


	return { firehose: firehose?.posts };
}

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
