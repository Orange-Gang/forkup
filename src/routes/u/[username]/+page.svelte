<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	export let data;

	const { user, current_user, posts, followers, following } = data;

	$: logged_user_is_following = followers.find(
		(f: { followerId: string; followingId: string }) => f.followerId === user.userId
	);
	$: console.log(logged_user_is_following);
</script>

<section class="flex flex-col items-center gap-2">
	<div class="flex flex-col items-center">
		<img
			src={current_user.avatar}
			alt={`${current_user.username} profile picture`}
			class="w-20 h-20 rounded-full"
		/>
		<p class="text-3xl font-bold">{current_user.displayName}</p>
		<p class="text-md">@{current_user.username}</p>
	</div>
	{#if user}
		{#if logged_user_is_following}
			<form method="POST" action="?/unfollow">
				<input name="id" type="hidden" value={current_user.id} />
				<button>Unfollow</button>
			</form>
		{:else}
			<form method="POST" action="?/follow">
				<input name="id" type="hidden" value={current_user.id} />
				<button>Follow</button>
			</form>
		{/if}
	{/if}
	<div class="flex flex-row justify-center gap-4">
		<p>{followers.length} Followers</p>
		<p>{following.length} Following</p>
	</div>
</section>

<section class="flex flex-col items-center gap-8 mt-8">
	{#each posts as post}
		<PostCard {post} author={current_user} />
	{/each}
</section>
