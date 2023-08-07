<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  let tab = "write";
  let content : string;

  function setTab(section : string) { tab = section; }
</script>

<section class="flex flex-col w-full h-full gap-4">

  <div class="flex flex-row gap-4 w-full">
    <button 
      on:click={() => setTab("write")}
      class:active={tab === "write"} 
      class="px-4 py-2 rounded-md transition-all duration-150"
    >
      Write
    </button>
    <button 
      class:active={tab === "preview"} 
      on:click={() => setTab("preview")}
      class="px-4 py-2 rounded-md transition-all duration-150"
    >
      Preview
    </button>
  </div>
  <section>
  {#if tab === "write"}
    <form method="POST" action="?/createPost">
      <textarea 
        bind:value={content} name="content" 
        class="w-full text-xl border p-2 scroll-p-2 resize-y"
      />
    </form>
  {:else if tab === "preview"}
    <div class="prose prose-img:max-w-xs w-full max-w-md">
      <Markdown md={content} />
    </div>
  {/if}
  </section>

</section>

<style>
  .active {
    background-color: lightgray;
  }
</style>
