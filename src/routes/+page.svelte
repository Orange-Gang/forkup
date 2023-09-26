<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import ContentEditor from '$lib/components/ContentEditor.svelte';
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const firehose = data?.firehose;
	const user = $page.data.user;

	console.log({ firehose });
</script>

<h3 class="text-2xl">Home</h3>
{#if user}
	<ContentEditor />
{/if}

<div class="flex flex-col w-full max-w-2xl mx-auto gap-2">
	{#each firehose as firepost}
		<PostCard post={firepost} author={firepost.author} />
	{/each}
</div>
