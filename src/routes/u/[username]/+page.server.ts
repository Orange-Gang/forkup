import { prisma_client } from '$lib/prisma';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const user_data = await prisma_client.user.findUnique({
		where: { username: params.username },
		include: {
			posts: true,
			followers: true,
			following: true,
			blockedBy: true,
			blockedUser: true
		}
	});

	if (!user_data) {
		throw error(404, 'User not found');
	}

	const { posts, followers, following, blockedBy, blockedUser, ...current_user } = user_data;

	return { current_user, posts, followers, following, blockedBy, blockedUser };
}

export const actions = {
	follow: async ({ request, locals }) => {
		const session = await locals.auth?.validate();
		const logged_user = session?.user;

		console.log({ logged_user });

		const form_data = await request.formData();
		const user_to_follow = form_data.get('id') as string;

		// follow user
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

		// unfollow user
		await prisma_client.follows.delete({
			where: {
				followerId_followingId: {
					followerId: logged_user.userId as string,
					followingId: user_to_unfollow as string
				}
			}
		});
	},
	block: async ({ request, locals }) => {
		const session = await locals.auth?.validate();
		const logged_user = session?.user;

		const form_data = await request.formData();
		const user_to_block = form_data.get('id') as string;

		// block user
		await prisma_client.blocked.create({
			data: {
				blockedById: logged_user.userId as string,
				blockedUserId: user_to_block
			}
		});
	},
	unblock: async ({ request, locals }) => {
		const session = await locals.auth?.validate();
		const logged_user = session?.user;

		const form_data = await request.formData();
		const user_to_unblock = form_data.get('id') as string;

		// unblock user
		await prisma_client.blocked.delete({
			where: {
				blockedById_blockedUserId: {
					blockedById: logged_user.userId as string,
					blockedUserId: user_to_unblock
				}
			}
		});
	}
};
