import { auth } from '$lib/server/lucia';

export async function load({ locals }) {
	const session = await locals.auth?.validate();
	console.log({ session });
	return { user: session?.user };
}
