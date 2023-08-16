// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import('$lib/server/lucia').Auth; // no change
	type DatabaseUserAttributes = {
		username: string;
		displayName: string;
		avatar: string;
	}; // formerly `UserAttributes`
	type DatabaseSessionAttributes = {}; // new
}

export {};
