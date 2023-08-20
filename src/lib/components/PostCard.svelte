<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { format } from 'timeago.js';
	import type { Post, User } from '@prisma/client';

	export let post: Post;
	export let author: User;
	let is_expanded = false;
	let content_height: number;

	function toggleExpand() {
		is_expanded = !is_expanded;
	}
</script>

<section class="relative flex flex-col w-full max-w-2xl px-8 gap-4 border">
	<div class="flex flex-row justify-between pt-4">
		<div class="flex flex-row gap-4">
			<img
				src={author.avatar}
				alt={author.username + ' profile picture'}
				class="w-12 h-12 rounded-full"
			/>
			<div class="flex flex-col">
				<a href={`/u/${author.username}`} class="font-bold">{author.displayName}</a>
				<a href={`/u/${author.username}`} class="hover:underline">
					@{author.username} <span>| {format(post.createdAt)}</span>
				</a>
			</div>
		</div>
	</div>

	<article bind:clientHeight={content_height} class="relative prose overflow-hidden">
		<div class={'w-full ' + (!is_expanded ? 'max-h-[24rem]' : 'h-full')}>
			<Markdown md={post.content} />
		</div>
	</article>

	{#if content_height >= 256}
		<div
			class={'inset-x-0 bottom-0 flex justify-center py-4 ' +
				(!is_expanded && 'absolute bg-gradient-to-t from-white')}
		>
			<button on:click={toggleExpand} class="border bg-orange-500 px-4 py-2 rounded-md">
				See More
			</button>
		</div>
	{/if}
</section>
