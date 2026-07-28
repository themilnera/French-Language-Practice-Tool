<script>
	import { pushState } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import llmRequest from '$lib/llmRequest';
	import { localStore } from '$lib/localStore.svelte.js';

	//for the local llm
	let api_url = $state('');
	let api_model = $state('');
	let generatedText = $state('');
	let generating = $state(false);

	let selectedVerb = $derived(page.url.pathname !== '/study' ?? null);
	let { data } = $props();
	let filterInput = $state('');
	let filter = $derived(removeAccents(filterInput.trim().toLowerCase()));
	let fullList = $derived(deriveList(data?.verbs) ?? []);
	let list = $derived(fullList ?? []);

	let selectedDefinition = $state('');
	let sdClass = $state('def_button');

	let selectedSubject = $state('');
	let sdSubject = $state('');

	let selectedTense = $state('');

	async function generateSentence() {
		generating = true;
		console.log('generating');
		let response = await llmRequest(
			`${api_url}`,
			api_model,
			"Tu es un générateur de phrases d'exemple en français pour un apprenant de la langue française. Tu dois répondre UNIQUEMENT avec la phrase générée, rien d'autre. Pas d'explication, pas de traduction, pas de guillemets, pas de commentaire — seulement la phrase elle-même. La phrase doit impérativement correspondre à l'usage, au sujet et au temps demandés.",
			`Génère une phrase d'exemple avec le verbe : ${selectedVerb.infinitive}, correspondant à cet usage : ${selectedDefinition}, en utilisant le sujet : ${selectedSubject} et le temps : ${selectedTense}.\n\nMaintenant, voici la phrase: `,
			0.9
		);
		generatedText = response;
		generating = false;
	}

	function deriveList(initialList) {
		let finalList = [];
		let infinitive = '';
		let pronomial = false;
		let subtype = '';
		let definitions = [];

		for (let i = 0; i < initialList.length; i++) {
			if (i === 0) {
				infinitive = initialList[i].infinitive;
				pronomial = initialList[i].pronomial;
				definitions = [{ definition: initialList[i].definition, subtype: initialList[i].subtype }];
			} else if (initialList[i - 1].infinitive !== initialList[i].infinitive) {
				finalList.push({ infinitive, pronomial, subtype, definitions });
				infinitive = initialList[i].infinitive;
				pronomial = initialList[i].pronomial;
				subtype = initialList[i].subtype;
				definitions = [{ definition: initialList[i].definition, subtype: initialList[i].subtype }];
			} else if (initialList[i - 1].infinitive === initialList[i].infinitive) {
				definitions.push({
					definition: initialList[i].definition,
					subtype: initialList[i].subtype
				});
			}
		}
		finalList.push({ infinitive, pronomial, subtype, definitions });
		return finalList;
	}

	function changeFilter() {
		list = [];
		if (filter != '') {
			fullList.forEach((verb) => {
				if (verb.infinitive.toLowerCase().startsWith(filter)) {
					list.push(verb);
				} else if (verb.pronomial) {
					if (filter == 's' || filter == 'se' || filter == "s'") {
						list.push(verb);
					} else {
						let pr = filter.replace(/(^s')\s*(\w+)/ || /(^s)\s*(\w+)/ || /(^se)\s*(\w+)/, '');
						if (verb.infinitive.toLowerCase().startsWith(pr.trim())) {
							list.push(verb);
						}
					}
				}
			});
		} else {
			list = fullList;
		}
	}
	const removeAccents = (str) => {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};
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
	<div class="max-w-200 md:w-[40%]">
		{#if !selectedVerb}
			<div class="flex h-screen flex-col justify-center bg-amber-50">
				<div class="mt-5 mb-5 self-center">
					<input
						placeholder="Find a verb to practice..."
						bind:value={filterInput}
						oninput={changeFilter}
					/>
				</div>
				<div
					class="flex min-h-0 w-full flex-1 flex-col items-start overflow-auto border-b-2 bg-red-50 p-5 md:border-l-2"
				>
					{#if fullList.length !== 0}
						{#each list as verb, index}
							<button
								class="mt-2 flex w-full flex-col rounded-2xl bg-red-50! p-2 text-start text-black! hover:cursor-pointer hover:bg-gray-200!"
								onclick={() => {
									pushState(`/study/${verb.infinitive}`);
									selectedVerb = verb;
									selectedDefinition = verb.definitions[0].definition;
									selectedSubject = 'je';
									selectedTense = 'présent';
								}}
							>
								<span class="mt-4 font-bold text-blue-800">
									{#if verb.pronomial && ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(verb.infinitive[0])}
										<span class="text-pink-600">S'</span>
									{/if}{verb.infinitive}
								</span>

								<div class="flex w-full rounded-xl bg-red-200 p-3">
									<div class="ml-auto w-full">
										<div class="flex flex-col justify-between text-[3vw] md:text-lg">
											{#each verb.definitions as d}
												<span class="flex justify-between pt-1"
													>{d.definition}
													<span class="text-violet-700">{d.subtype ? `${d.subtype}` : ''}</span
													></span
												>
											{/each}
										</div>
									</div>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center">
				<div class="mt-10 flex h-180 w-[80%] flex-col items-center rounded-2xl bg-amber-50 p-3">
					<h1 class="flex-1">{selectedVerb.infinitive}</h1>
					<div class="mb-5 flex w-full flex-6 flex-col items-center">
						<select bind:value={selectedDefinition} class="w-[50%]">
							{#each selectedVerb.definitions as d}
								<option value={d.definition}>
									{d.definition}
									<span class="text-violet-700">{d.subtype ? `(${d.subtype})` : ''}</span>
								</option>
							{/each}
						</select>
						<div class="">
							<form class="mt-2 flex flex-col items-center gap-2">
								<div class="flex gap-4">
									<label for="je"
										><input
											bind:group={selectedSubject}
											name="subject"
											type="radio"
											id="je"
											value="je"
											checked
											class="mr-2"
										/>je</label
									>

									<label for="tu"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="tu"
											value="tu"
											class="mr-2"
										/>tu</label
									>

									<label for="on"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="on"
											value="on"
											class="mr-2"
										/>on</label
									>

									<label for="vous"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="vous"
											value="vous"
											class="mr-2"
										/>vous</label
									>

									<label for="il"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="il"
											value="il"
											class="mr-2"
										/>il</label
									>
								</div>
								<div class="flex gap-5">
									<label for="elle"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="elle"
											value="elle"
											class="mr-2"
										/>elle</label
									>
									<label for="ils"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="ils"
											value="ils"
											class="mr-2"
										/>ils</label
									>

									<label for="elles"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="elles"
											value="elles"
											class="mr-2"
										/>elles</label
									>

									<label for="nous"
										><input
											bind:group={selectedSubject}
											type="radio"
											id="nous"
											value="nous"
											class="mr-2"
										/>nous</label
									>
								</div>
							</form>
						</div>
						<div class="mt-10 flex w-full flex-1 flex-col items-center">
							<form class="flex w-[70%] justify-between text-lg">
								<div class="flex flex-col flex-wrap gap-2">
									<label for="présent"
										><input
											bind:group={selectedTense}
											name="subject"
											type="radio"
											id="présent"
											value="présent"
											class="mr-2"
											checked
										/>présent</label
									>

									<label for="passé composé"
										><input
											bind:group={selectedTense}
											type="radio"
											id="passé composé"
											value="passé composé"
											class="mr-2"
										/>passé composé</label
									>

									<label for="imparfait"
										><input
											bind:group={selectedTense}
											type="radio"
											id="imparfait"
											value="imparfait"
											class="mr-2"
										/>imparfait</label
									>

									<label for="futur proche"
										><input
											bind:group={selectedTense}
											type="radio"
											id="futur proche"
											value="futur proche"
											class="mr-2"
										/>futur proche</label
									>

									<label for="future simple"
										><input
											bind:group={selectedTense}
											type="radio"
											id="futur simple"
											value="futur simple"
											class="mr-2"
										/>futur simple</label
									>
									<label for="subjonctif"
										><input
											bind:group={selectedTense}
											type="radio"
											id="subjonctif"
											value="subjonctif"
											class="mr-2"
										/>subjonctif</label
									>
								</div>
								<div class="flex flex-col flex-wrap gap-2">
									<label for="conditionnel">
										<input
											bind:group={selectedTense}
											type="radio"
											id="conditionnel"
											value="conditionnel"
											class="mr-2"
										/>conditionnel</label
									>

									<label for="passé conditionnel"
										><input
											bind:group={selectedTense}
											type="radio"
											id="passé conditionnel"
											value="passé conditionnel"
											class="mr-2"
										/>passé conditionnel</label
									>

									<label for="plus-que-parfait"
										><input
											bind:group={selectedTense}
											type="radio"
											id="plus-que-parfait"
											value="plus-que-parfait"
											class="mr-2"
										/>plus-que-parfait</label
									>

									<label for="futur parfait"
										><input
											bind:group={selectedTense}
											type="radio"
											id="futur parfait"
											value="futur parfait"
											class="mr-2"
										/>futur parfait</label
									>
									<label for="imperatif">
										<input
											bind:group={selectedTense}
											class="mr-2"
											type="radio"
											id="imperatif"
											value="imperatif"
										/>imperatif</label
									>
								</div>
							</form>
						</div>
					</div>
					<div class="h-full p-3" contenteditable="false" bind:innerText={generatedText}></div>
					{#if !generating}
						<button onclick={generateSentence}>Generate Example Sentence</button>
					{:else}
						<div class="loader"></div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
