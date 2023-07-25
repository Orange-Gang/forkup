import lucia from "lucia-auth";
import prisma from "@lucia-auth/adapter-prisma";
import { sveltekit } from "lucia-auth/middleware";
import { github } from "@lucia-auth/oauth/providers";

import { dev } from "$app/environment";
import { prisma_client } from "$lib/prisma";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

export const auth = lucia({
	adapter: prisma(prisma_client),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
  transformDatabaseUser: (userData) => {
    console.log({ userData });
    return {
      userId: userData.id,
      username: userData.username,
    }
  }
});

export type Auth = typeof auth;
export const githubAuth = github(auth, {
  clientId: GITHUB_CLIENT_ID, 
  clientSecret: GITHUB_CLIENT_SECRET 
});
