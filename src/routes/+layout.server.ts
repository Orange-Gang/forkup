import type { LayoutServerLoad } from './$types';

export async function load({ locals }) {
  const session = await locals.auth?.validate();
  return { user: session?.user }
}
