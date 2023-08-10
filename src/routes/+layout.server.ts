import { auth } from "$lib/server/lucia";

export async function load({ locals }) {
  const session = await locals.auth?.validate();
  return { user: session?.user }
}
