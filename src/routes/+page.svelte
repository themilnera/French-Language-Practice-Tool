<script>
	import 'animate.css';
	import { localStore } from '$lib/localStore.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let error_message = $state('');

	//conditional rendering
	let loaded = $state(false);
	let testing = $state(false);

	//bound inputs
	let input_url = $state('');
	let input_model = $state('');

	//mode options
	let menu = $state('mode');

	// //api test bools
	// let api_confirmed = $state(false);
	// let api_failed = $state(false);
	// //confirmed params
	// let api_url = $state('');
	// let api_model = $state('');

	// let local_api = $state('');
</script>

<div class="color-mid-olive">
	<div class="m-0 flex h-svh items-center justify-center border-2">
		<div class="menu flex h-[80%] w-105 flex-col items-center gap-3 rounded-2xl border-2 p-5">
			<h1>Welcome back!</h1>

			{#if menu == 'mode'}
				<button
					onclick={() => {
						goto('/study');
					}}
					class="def_button mt-30 mb-1">Study Mode</button
				>
				<button
					class="def_button"
					onclick={() => {
						goto('/test');
					}}>Test Mode</button
				>
			{:else if menu == 'study' || menu == 'test'}
				<button
					onclick={() => {
						menu = 'mode';
					}}
					class="red_button mt-15">Back</button
				>
			{/if}
		</div>
	</div>
</div>
