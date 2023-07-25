import { auth } from "$lib/server/lucia.ts";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const { user } = await locals.auth.validateUser();
  if (!user) { throw redirect(303, "/"); }
}

export const actions = {
  signOut: async ({ locals }) => {
    const { session } = await locals.auth.validateUser();
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
    throw redirect(303, "/");
  }
}
