<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const user = data.user;
</script>

<h3 class="text-2xl">Profile</h3>
<p>{user.displayName}</p>
<p>{user.username}</p>
