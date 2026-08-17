<script>
	import Nav from '../../components/Nav.svelte';
	import Test from '../../components/Test.svelte';
	let { data } = $props();
</script>

<div class="max-h-[100svh] overflow-y-hidden">
	<Nav />
	{#if data}
		<Test {data} />
	{/if}
</div>
