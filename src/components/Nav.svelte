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
	<div class="color-lighter-indigo flex h-full w-200 items-center justify-between gap-5 rounded-b-lg border-r-2 border-b-2 border-l-2 border-gray-700!">
		<div class="ml-10 flex gap-5">
			<button
				onclick={() => {
					setTimeout(() => goto('/study'), 0);
				}}
				class={slug == 'study' ? 'cursor-pointer border-b-2 p-2 text-shadow-blue-50 hover:text-shadow-xs' : 'cursor-pointer p-2 text-shadow-blue-50 hover:text-shadow-xs'}>Study Mode</button
			>
			<button
				onclick={() => {
					setTimeout(() => goto('/test'), 0);
				}}
				class={slug == 'test' ? 'cursor-pointer border-b-2 p-2 text-shadow-blue-50 hover:text-shadow-xs' : 'cursor-pointer p-2 text-shadow-blue-50 hover:text-shadow-xs'}>Test Mode</button
			>
		</div>
		<button class="mr-10 w-10 cursor-pointer text-gray-200 hover:text-gray-800"><SettingsIcon /></button>
	</div>
</div>
