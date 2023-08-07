<script lang="ts">
  import type { LayoutData } from "../$types";

  export let data : LayoutData;
  const user = data.user;
</script>

<h3 class="text-2xl">Profile</h3>
<p>{user.displayName}</p>
<p>{user.username}</p>
