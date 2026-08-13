<script>
	import Nav from '../../components/Nav.svelte';
	import Test from '../../components/Test.svelte';
	let { data } = $props();
</script>

<Nav />
{#if data}
	<Test {data} />
{/if}
