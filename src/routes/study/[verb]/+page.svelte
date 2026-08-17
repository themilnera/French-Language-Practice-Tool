<script>
	import Study from '../../../components/Study.svelte';
	import Nav from '../../../components/Nav.svelte';
	let { data } = $props();
</script>

<div class="max-h-[100svh] overflow-y-hidden">
	<Nav />
	{#if data}
		<Study {data} />
	{/if}
</div>
