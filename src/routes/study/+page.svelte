<script>
	import { onMount } from 'svelte';
	import Study from '../../components/Study.svelte';
	let { data } = $props();
</script>

<div>
	<Study {data} />
</div>
