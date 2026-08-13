<script>
	import { onMount } from 'svelte';
	import Study from '../../components/Study.svelte';
	let { data } = $props();
	import { page } from '$app/state';
	let slug = $derived(decodeURIComponent(page.url.pathname.split('/')[1]) ?? null);
	import SettingsIcon from '@iconify-svelte/material-symbols/settings';
	import { goto } from '$app/navigation';
	import Nav from '../../components/Nav.svelte';
	onMount(() => {
		if (slug) console.log(slug);
	});
</script>

<Nav />
<Study {data} />
