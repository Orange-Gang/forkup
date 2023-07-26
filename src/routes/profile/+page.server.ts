import { auth } from "$lib/server/lucia";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const session = await locals.auth.validate();
  if (!session) { throw redirect(303, "/"); }
}

export const actions = {
  signOut: async ({ locals }) => {
    const session = await locals.auth.validate();
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
    throw redirect(303, "/");
  }
}
