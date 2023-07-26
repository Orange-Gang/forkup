import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { sveltekit } from "lucia/middleware";
import { github } from "@lucia-auth/oauth/providers";

import { dev } from "$app/environment";
import { prisma_client } from "$lib/prisma";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

export const auth = lucia({
	adapter: prisma(prisma_client),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
  getUserAttributes: (data) => {
    return {
      // 'userId' is included by default
      username: data.username,
      displayName: data.displayName,
      avatar: data.avatar
    } 
  },
});

export type Auth = typeof auth;

export const githubAuth = github(auth, {
  clientId: GITHUB_CLIENT_ID, 
  clientSecret: GITHUB_CLIENT_SECRET 
});
