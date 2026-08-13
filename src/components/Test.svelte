<script>
	import { deriveList } from '$lib/functions';
	import llmRequest from '$lib/llmRequest';
	import { localStore } from '$lib/localStore.svelte';
	import { onMount } from 'svelte';
	let api_url = $state('');
	let api_model = $state('');
	let { data } = $props();
	let fullList = $derived(shuffle(deriveList(data?.verbs?.sort((a, b) => a.infinitive.localeCompare(b.infinitive)))) ?? []);
	let subjects = $state(shuffle(['je', 'tu', 'on', 'vous', 'il', 'elle', 'ils', 'elles', 'nous']));
	let tenses = $state(shuffle(['présent', 'passé composé', 'imparfait', 'futur proche', 'futur simple', 'subjonctif', 'conditionnel', 'passé conditionnel', 'plus-que-parfait', 'futur parfait']));
	let started = $state(false);
	let checking = $state(false);
	let generating = $state(false);
	let currentVerb = $state(null);
	let currentSubject = $state('');
	let currentTense = $state('');

	let inputSentence = $state('');
	let responseField = $state('');
	let infIndex = $state(0);
	let subIndex = $state(0);
	let tenseIndex = $state(0);

	let nextButtonText = $derived(!started ? 'Start' : 'Next');

	async function gradeChallenge() {
		checking = true;
		let response = await llmRequest(
			`${api_url}`,
			api_model,
			`RESPOND IN PlAINTEXT ONLY, NO FORMATTING, ASTERISKS, ETC. A student is learning french. They've been told to write a sentence using a verb, in a specific tense, with a specific subject. Your job is to check whether their sentence is correct, provide the corrected version if not, and an explanation if necessary.`,
			`Verb:${currentVerb}, Subject ${currentSubject}, Tense ${currentTense}, The student's sentence: ${inputSentence}.\nMy response: `,
			0.4
		);
		responseField = response;
		checking = false;
	}
	function getTest() {
		responseField = '';
		inputSentence = '';
		started = true;

		if (infIndex >= fullList.length) {
			infIndex = 0;
		}
		if (subIndex >= subjects.length) {
			subIndex = 0;
		}
		if (tenseIndex >= tenses.length) {
			tenseIndex = 0;
		}
		currentVerb = fullList[infIndex];
		currentSubject = subjects[subIndex];
		currentTense = tenses[tenseIndex];
		infIndex++;
		subIndex++;
		tenseIndex++;
	}
	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	async function loadAll() {
		let local_api = await localStore('local_api', '');
		if (local_api && local_api.value != '') {
			let parts = local_api.value.split('AND');
			api_url = parts[0];
			api_model = parts[1];
		}
	}
	onMount(() => {
		loadAll();
	});
</script>

<div class="color-mid-olive flex flex-col items-center justify-center">
	<div class="w-[90%] max-w-200">
		<div class="mt-10 flex h-185 w-full flex-col items-center rounded-2xl bg-amber-50">
			<h1 class="mt-20">Verb Tester</h1>
			{#if started}
				<div class="mt-10 flex h-[50%] w-[80%] flex-col items-center rounded-2xl bg-amber-50">
					<div class="flex w-100 flex-1 flex-col rounded-2xl bg-blue-900 p-5 text-center text-white">
						<h3>Write a sentence using...</h3>
						<div class="flex items-center justify-between border-b border-white">
							<span class="text-2xl text-purple-300">Verb:</span>
							<span>{currentVerb?.infinitive}</span>
						</div>
						<div class="flex items-center justify-between border-b border-white">
							<span class="text-2xl text-red-400">Subject:</span>
							<span class="">{currentSubject}</span>
						</div>
						<div class="flex items-center justify-between border-b border-white">
							<span class="text-2xl text-cyan-300">Tense:</span><span>{currentTense}</span>
						</div>
					</div>

					{#if responseField !== ''}
						<div class="m-5 h-full w-full flex-1 overflow-auto rounded-2xl border bg-white p-3 text-sm" contenteditable="false" bind:innerText={responseField}></div>
					{/if}
				</div>
				<input class="mt-5 w-[76%]" bind:value={inputSentence} />
			{/if}
			<div class="w-80% mb-3 flex items-center justify-center gap-3 pt-5">
				{#if !checking}
					{#if started}
						<button class="blue_button flex-5 text-lg!" onclick={gradeChallenge}>Correct My Sentence</button>
					{/if}
					<button class="def_button flex-1 text-lg!" onclick={getTest}>{nextButtonText}</button>
				{/if}
				{#if checking}
					<div class="ellipsis-anim mt-4 mb-3 ml-6 text-[17px]"></div>
				{/if}
			</div>
		</div>
	</div>
</div>
