<script>
	import Study from '../../../components/Study.svelte';
	import Nav from '../../../components/Nav.svelte';
	let { data } = $props();
</script>

<Nav />
{#if data}
	<Study {data} />
{/if}
