import type { PageServerLoad } from './$types';
import { prisma_client } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth?.validate();
	const user = session?.user;

	console.log({ user });

	const user_data = await prisma_client.user.findUnique({
		where: { id: user.userId },
		select: {
			following: {
				select: {
					followingId: true
				}
			}
		}
	});

	if (user_data?.following) {
		const following_ids: string[] = [];
		user_data.following.forEach((element) => {
			following_ids.push(element.followingId);
		});

		const following_firehose = await prisma_client.post.findMany({
			where: {
				author: { id: { in: following_ids } }
			},
			include: { author: true },
			orderBy: { createdAt: 'desc' }
		});

		/*
		const following_firehose: { author: User; post: Post }[] = [];
		following_data.forEach((element) => {
			const { author, ...post } = element;
			following_firehose.push({ author, post });
		});
    */

		return { following_firehose };
	}

	return { following_firehose: null };
};
