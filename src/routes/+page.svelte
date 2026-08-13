<script>
	import 'animate.css';
	import { localStore } from '$lib/localStore.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import llmRequest from '$lib/llmRequest';
	let error_message = $state('');

	//conditional rendering
	let loaded = $state(false);
	let testing = $state(false);

	//bound inputs
	let input_url = $state('');
	let input_model = $state('');

	//mode options
	let menu = $state('mode');

	//api test bools
	let api_confirmed = $state(false);
	let api_failed = $state(false);
	//confirmed params
	let api_url = $state('');
	let api_model = $state('');

	let local_api = $state('');
	async function loadAll() {
		local_api = await localStore('local_api', '');
		if (local_api && local_api.value != '') {
			let parts = local_api.value.split('AND');
			api_url = parts[0];
			api_model = parts[1];
		}
		loaded = true;
	}
	onMount(() => {
		loadAll();
	});
	async function testApi() {
		testing = true;
		api_failed = false;
		error_message = '';
		if (input_url == '') {
			error_message += 'Must enter an API URL. ';
			api_failed = true;
		}
		if (input_model == '') {
			error_message += 'Must enter a model name. ';
			api_failed = true;
		}
		if (!api_failed) {
			try {
				console.log(input_model);
				console.log(input_url);
				const res = await fetch(`http://${input_url}/api/generate`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						model: input_model,
						prompt: 'Répondez par **un seul mot**, oui ou non. Êtes-vous ici?',
						stream: false
					})
				});
				const data = await res.json();
				if (data.response) {
					console.log(data.response);
					api_confirmed = true;
					api_url = input_url;
					api_model = input_model;
					local_api.value = `${input_url}AND${input_model}`;
				}
			} catch (error) {
				console.log('Failed to fetch request from specified API: ' + error);
				error_message += error;
				api_failed = true;
			}
		}
	}
</script>

<div class="color-mid-olive">
	{#if !loaded}
		<div class="flex h-svh flex-col items-center justify-center">
			<div class="loader"></div>
		</div>
	{/if}

	{#if loaded && local_api.value != ''}
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
				<div class="text-md mt-auto">
					<p class="text-blue-700">{api_url}</p>
					<p class="text-blue-700">{api_model}</p>
					<button
						class="red_button"
						onclick={() => {
							local_api.value = '';
						}}>Reset</button
					>
				</div>
			</div>
		</div>
	{:else if loaded && local_api.value == ''}
		<div class="m-0 flex h-svh items-center justify-center border-2">
			<div class="menu flex h-200 w-105 flex-col items-center gap-3 rounded-2xl border-2 p-5">
				<h1>Local LLM:</h1>
				<p class="pr-5 pl-5">
					This is a French language practice tool designed to be used with a local LLM (ran on your
					PC, for example, with Ollama).
				</p>
				<p class="pr-5 pl-5">
					In order to use it, you'll need to set up a local LLM and enter the URL and model name
					below:
				</p>
				<div class="mt-10 flex w-[85%] items-center gap-2">
					<p>http://</p>
					<input
						bind:value={input_url}
						class="w-full rounded-xl"
						placeholder="localhost:11434 (Ollama)"
					/>
				</div>
				<div class="mt-3 w-[85%]">
					<input
						bind:value={input_model}
						class="w-full rounded-xl"
						placeholder="jobautomation/OpenEuroLLM-French"
					/>
				</div>
				{#if !testing}
					<button onclick={testApi} class="mt-5">Test API Connection</button>
				{:else if testing && !api_confirmed && !api_failed}
					<div class="loader"></div>
				{:else if testing && !api_confirmed && api_failed}
					<div class="pr-5 pl-5 text-red-800">Something went wrong: {error_message}</div>
					<button onclick={testApi} class="mt-5">Try Again</button>
				{:else if testing && api_confirmed}
					<div text-green-800>Success!</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
