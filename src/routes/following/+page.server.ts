import type { PageServerLoad } from "./$types";
import { prisma_client} from "$lib/prisma"
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({locals}) => {

  const session = await locals.auth?.validate();
  const user = session?.user;
  const firehoseWithFollowers = await prisma_client.user.findUnique({
    where: {
      id: user?.userId
    },
    select: {
      following: {
        select: {
          following: {
            select: {
              posts: {
                include: {
                  author: true
                },
                take: 10,
                orderBy: { createdAt: 'desc' }
              }
            }
          }
        },
        where: {
          followerId: {
            equals: user?.userId
          }
        }
      },
      posts: {
        include: {
          author: true
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    },
  })

  if (!firehoseWithFollowers) {
    throw error(404, "No posts found")
  }

  // not sure how to sort the two different results
  // right now whatever is first in the return array will be first
  // but that's not right...
  // is there a way in prisma to return the users posts and the follwers posts in the same array?
  // instead of having to merge them after?
  const usersPosts = firehoseWithFollowers.posts;
  const followersPosts = firehoseWithFollowers?.following[0].following.posts


	return { firehose: [...usersPosts, ...followersPosts ] };
}
