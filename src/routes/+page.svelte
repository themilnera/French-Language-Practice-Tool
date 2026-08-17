<script>
	import 'animate.css';
	import { localStore } from '$lib/localStore.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let loaded = $derived(data.verbs ? true : false);
	$effect(() => {
		if (loaded) {
			goto('/study');
		}
	});
</script>

<div class="color-mid-indigo">
	<div class="m-0 flex h-svh items-center justify-center border-2">
		<div class="loader"></div>
	</div>
</div>
