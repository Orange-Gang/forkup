<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data : LayoutData;
  const user = data.user;
</script>

<div class="flex flex-col gap-8 w-full h-full min-w-screen min-h-screen">
	<nav class="flex flex-row justify-between items-center w-full h-fit px-8 py-4">
		<a href="/" class="text-2xl font-bold">Forkup</a>

		<div class="flex flex-row gap-4 items-center">
			{#if user}
				<a href={`/u/${user.username}`}>
					<img src={user.avatar} alt="Profile" class="rounded-full w-8 h-8 lg:w-12 lg:h-12" />
				</a>
				<form method="POST" action="/profile?/signOut">
					<button
						class="text-black border bg-white px-4 py-2 transition-all duration-300 hover:bg-black hover:text-white"
					>
						Sign out
					</button>
				</form>
			{:else}
				<a
					href="/login/github/oauth"
					class="text-black border bg-white px-4 py-2 transition-all duration-300 hover:bg-black hover:text-white"
				>
					Sign in with Github
				</a>
			{/if}
		</div>
	</nav>

  <main class="flex flex-col p-8 grow w-full h-full">
    <slot />
  </main>

	<footer class="justify-self-end text-center py-4">
		<p>
			Made with 🧡 by the <a class="underline" href="https://github.com/orange-gang">Orange Gang</a>
		</p>
	</footer>
</div>
