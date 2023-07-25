<script lang="ts">
  export let data : LayoutData;

  const user = data.user;
</script>

<h3 class="text-2xl">Profile</h3>
<p>{user.username}</p>
