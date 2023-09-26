<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { format } from 'timeago.js';
	import type { Post, User, Reaction } from '@prisma/client';
	import { page } from '$app/stores';

	export let post: Post;
	export let author: User;
	const user = $page.data.user;
	let is_expanded = false;
	let is_menu_expanded = false;
	let content_height: number;

	function toggleExpand() {
		is_expanded = !is_expanded;
	}

	function menuExpand() {
		is_menu_expanded = !is_menu_expanded;
	}

	$: is_logged_in_post = user ? author.id === user.userId : false;
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

		{#if is_logged_in_post}
			<button on:click={menuExpand} class="relative">
				<span class="text-red-500 border border-red-500 px-4 py-2 rounded-xl"> Delete </span>
				{#if is_menu_expanded}
					<div class="absolute w-fit px-4 py-2 -mb-12 flex flex-row gap-2 justify-self-center">
						<form method="POST" action="?/deletePost">
							<input name="id" type="hidden" value={post.id} />
							<button>Yes</button>
						</form>
						<button>No</button>
					</div>
				{/if}
			</button>
		{/if}
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
