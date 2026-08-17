<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	let slug = $derived(decodeURIComponent(page.url.pathname.split('/')[1]) ?? null);
	import SettingsIcon from '@iconify-svelte/material-symbols/settings';
	import { goto } from '$app/navigation';
	onMount(() => {
		if (slug) console.log(slug);
	});

	//I'm planning to have some settings you can change but there's no use having the settings wheel without them right this moment
</script>

<div class="flex h-23 items-center justify-center">
	<div class="color-lighter-indigo flex h-full w-200 items-center justify-center gap-5 text-blue-50 md:rounded-b-lg md:border-r-2 md:border-b-2 md:border-l-2 md:border-gray-700!">
		<div class="xs:text-sm flex gap-5 md:text-lg">
			<button
				onclick={() => {
					setTimeout(() => goto('/study'), 0);
				}}
				class={slug == 'study' ? 'color-mid-indigo cursor-pointer rounded-xl border-b-2 p-2 hover:bg-blue-800!' : 'cursor-pointer rounded-xl p-2 text-shadow-blue-900 hover:bg-gray-700!'}
				>Study Mode</button
			>
			<button
				onclick={() => {
					setTimeout(() => goto('/test'), 0);
				}}
				class={slug == 'test'
					? 'color-mid-indigo cursor-pointer rounded-xl border-b-2 p-2 text-shadow-blue-500 hover:bg-blue-800!'
					: 'cursor-pointer rounded-xl p-2 text-shadow-blue-900 hover:bg-gray-700'}>Test Mode</button
			>
		</div>
		<!-- <button class="mr-10 w-10 cursor-pointer text-gray-200 hover:text-gray-800"><SettingsIcon /></button> -->
	</div>
</div>
