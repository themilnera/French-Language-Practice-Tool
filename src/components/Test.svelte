<script>
	import { deriveList } from '$lib/functions';
	import llmRequest from '$lib/llmRequest';
	import { localStore } from '$lib/localStore.svelte';
	import { onMount } from 'svelte';
	let api_url = $state('');
	let api_model = $state('');
	let { data } = $props();
	let fullList = $derived(
		shuffle(deriveList(data?.verbs?.sort((a, b) => a.infinitive.localeCompare(b.infinitive)))) ?? []
	);
	let subjects = $state(shuffle(['je', 'tu', 'on', 'vous', 'il', 'elle', 'ils', 'elles', 'nous']));
	let tenses = $state(
		shuffle([
			'présent',
			'passé composé',
			'imparfait',
			'futur proche',
			'futur simple',
			'subjonctif',
			'conditionnel',
			'passé conditionnel',
			'plus-que-parfait',
			'futur parfait',
			'imperatif'
		])
	);
	let testing = $state(false);
	let generating = $state(false);
	let currentVerb = $state(null);
	let currentSubject = $state('');
	let currentTense = $state('');

	let inputSentence = $state('');
	let responseField = $state('');
	let infIndex = $state(0);
	let subIndex = $state(0);
	let tenseIndex = $state(0);

	async function gradeChallenge() {
		generating = true;
		console.log('Generating...');
		let response = await llmRequest(
			`${api_url}`,
			api_model,
			"Tu es un correcteur de phrases françaises. Ta seule tâche est de corriger la phrase fournie par l'étudiant selon le verbe, le sujet et le temps donnés.",
			`Voici la phrase de l'étudiant: ${inputSentence}`,
			0.9
		);
		console.log(response);
		responseField = response;
		generating = false;
	}
	function getTest() {
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

<div class="flex flex-col items-center">
	<div class="w-130 max-w-200 xl:w-[50%]">
		<div class="flex h-screen flex-col items-center bg-amber-50">
			<h1 class="mt-5">Verb Tester</h1>
			<div class="mt-10 flex h-[50%] w-[80%] flex-col items-center rounded-2xl bg-white">
				<p class="p-10 text-left">Learn by writing sentences using common verbs.</p>

				<div>Verb: {currentVerb?.infinitive}</div>
				<div>Subject: {currentSubject}</div>
				<div>Tense: {currentTense}</div>
				<div></div>
				<div
					class="m-5 h-full w-full overflow-auto rounded-2xl border-2 p-3 text-sm"
					contenteditable="false"
					bind:innerText={responseField}
				></div>
			</div>
			<input class="w-[90%]" bind:value={inputSentence} />
			<div class="w-80% mb-3 flex items-center justify-center gap-3 pt-5">
				<button class="flex-5 text-lg!" onclick={gradeChallenge}>Grade My Sentence</button>
				<button class="red_button flex-1 text-lg!" onclick={getTest}>Next Challenge</button>
			</div>
		</div>
	</div>
</div>
