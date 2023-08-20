<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import ContentEditor from '$lib/components/ContentEditor.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const firehose = data?.firehose;
</script>

<h3 class="text-2xl">Home</h3>
<ContentEditor />

<div class="flex flex-col mx-auto gap-8">
	{#each firehose as firepost}
		<PostCard post={firepost} author={firepost.author} />
	{/each}
</div>
