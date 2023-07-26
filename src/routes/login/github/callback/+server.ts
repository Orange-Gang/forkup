import { redirect } from "@sveltejs/kit";
import { auth, githubAuth } from "$lib/server/lucia.js";
import { OAuthRequestError } from "@lucia-auth/oauth";

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get("github_oauth_state");
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
    console.log("invalidated state");
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { existingUser, githubUser, createUser } =
			await githubAuth.validateCallback(code);

    console.log({ githubUser });

		const getUser = async () => {
			if (existingUser) return existingUser;
      
			const user = await createUser({
				attributes: {
					username: githubUser.login,
          displayName: githubUser.name,
          avatar: githubUser.avatar_url
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);

	} catch (e) {
    console.log("ERROR", { e });
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}

  throw redirect(303, "/");
};
