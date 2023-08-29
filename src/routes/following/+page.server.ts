import type { PageServerLoad } from './$types';
import { prisma_client } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth?.validate();
	const user = session?.user;

	const followingFirehose = await prisma_client.user.findMany({
		where: {
			followers: {
				some: {
					followerId: user?.userId
				}
			}
		},
		include: {
			posts: {
				include: {
					author: true
				}
			}
		}
	});

	return { following_firehose: followingFirehose[0].posts };
};
