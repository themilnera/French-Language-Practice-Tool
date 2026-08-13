<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	let slug = $derived(decodeURIComponent(page.url.pathname.split('/')[1]) ?? null);
	import SettingsIcon from '@iconify-svelte/material-symbols/settings';
	import { goto } from '$app/navigation';
	onMount(() => {
		if (slug) console.log(slug);
	});
</script>

<div class="flex h-23 justify-center">
	<div class="! flex h-full w-200 items-center justify-center gap-5 rounded-b-xl border-r-3 border-b-3 border-l-3 border-olive-700! bg-olive-500!">
		<button
			onclick={() => {
				goto('/study');
			}}
			class={slug == 'study' ? 'def_button border-3 border-green-200! bg-green-800!' : 'def_button border-3 border-green-900 bg-green-800!'}>Study Mode</button
		>
		<button
			onclick={() => {
				if (slug !== 'test') goto('/test');
			}}
			class={slug == 'test' ? 'def_button border-3 border-green-200! bg-green-800!' : 'def_button border-3 border-green-900 bg-green-800!'}>Test Mode</button
		>
		<button class="w-10 cursor-pointer text-gray-200 hover:text-gray-800"><SettingsIcon /></button>
	</div>
</div>
