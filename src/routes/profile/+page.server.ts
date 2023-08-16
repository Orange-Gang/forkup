import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	signOut: async ({ locals }) => {
		const session = await locals.auth.validate();
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
		throw redirect(303, '/');
	}
};
