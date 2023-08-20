import { prisma_client } from '$lib/prisma';

export async function load({ params }) {
	const user_data = await prisma_client.user.findUnique({
		where: { username: params.username },
		include: {
			posts: true,
			followers: true,
			following: true
		}
	});

	const { posts, followers, following, ...current_user } = user_data;

	return { current_user, posts, followers, following };
}

export const actions = {
	follow: async ({ request, locals }) => {
		const session = await locals.auth?.validate();
		const logged_user = session?.user;

		console.log({ logged_user });

		const form_data = await request.formData();
		const user_to_follow = form_data.get('id');

		// update follow
		await prisma_client.follows.create({
			data: {
				followerId: logged_user.userId as string,
				followingId: user_to_follow as string
			}
		});
	},
	unfollow: async ({ request, locals }) => {
		const session = await locals.auth?.validate();
		const logged_user = session?.user;

		const form_data = await request.formData();
		const user_to_unfollow = form_data.get('id');

		await prisma_client.follows.delete({
			where: {
				followerId_followingId: {
					followerId: logged_user.userId as string,
					followingId: user_to_unfollow as string
				}
			}
		});
	}
};
