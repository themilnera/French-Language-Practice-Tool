<script>
	import { pushState } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { localStore } from '$lib/localStore.svelte.js';
	import { deriveList } from '$lib/functions';
	import { json } from '@sveltejs/kit';
	//for the local llm
	let api_url = $state('');
	let api_model = $state('');
	let generatedText = $state('');
	let generating = $state(false);
	let generateError = $state(false);
	//url slug
	let slug = $derived(decodeURIComponent(page.url.pathname.split('/study/')[1]) ?? null);
	let selectedVerb = $derived(page.state.verb ?? null);

	let { data } = $props();
	let fullList = $derived(deriveList(data?.verbs?.sort((a, b) => a.infinitive.localeCompare(b.infinitive))) ?? []);
	let list = $derived(fullList ?? []);

	let filterInput = $state('');
	let filter = $derived(removeAccents(filterInput.trim().toLowerCase()));

	let selectedDefinition = $state('');
	let sdClass = $state('def_button');

	let selectedSubject = $state('je');
	let sdSubject = $state('');

	let selectedTense = $state('présent');
	let imperative = $derived(selectedTense === 'imperatif' ? true : false);

	async function generateSentence() {
		generateError = false;
		generating = true;
		console.log('generating');
		try {
			let response = await fetch('/api/llm', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					system:
						"Tu es un générateur de phrases d'exemple en français pour un apprenant de la langue française. Tu dois répondre UNIQUEMENT avec la phrase générée, rien d'autre. La phrase doit impérativement correspondre à l'usage, au sujet et au temps demandés.",
					prompt: `Génère une phrase d'exemple avec le verbe : ${selectedVerb.pronomial ? "se/s' " : ''}${selectedVerb.infinitive}, correspondant à cet usage : ${selectedDefinition}, en utilisant le sujet : ${selectedSubject} et le temps : ${selectedTense}.\n`,
					temperature: 0.3
				})
			});
			const data = await response.json();
			generatedText = data.result;
		} catch (error) {
			generateError = true;
			generatedText = 'Failed to generate, error: ' + error;
		}
		generating = false;
	}

	function changeFilter() {
		list = [];
		if (filter != '') {
			fullList.forEach((verb) => {
				if (removeAccents(verb.infinitive).toLowerCase().startsWith(filter)) {
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
	// async function loadAll() {
	// 	let local_api = await localStore('local_api', '');
	// 	if (local_api && local_api.value != '') {
	// 		let parts = local_api.value.split('AND');
	// 		api_url = parts[0];
	// 		api_model = parts[1];
	// 	}
	// }  //I may decide to make a local version of this app in the future
	onMount(() => {
		// loadAll();
		if (slug !== null && slug !== '') {
			selectedVerb = fullList.find((v) => slug.toLowerCase() === v.infinitive.toLowerCase());
		}
	});
	$effect(() => {
		if (selectedVerb) {
			selectedDefinition = selectedVerb.definitions[0].definition;
			selectedSubject = 'je';
			selectedTense = 'présent';
		}
	});
</script>

<div class="flex flex-col items-center justify-center">
	<div class="mb-10 flex w-full max-w-200 items-center justify-center">
		{#if !selectedVerb}
			<div class="color-mid-indigo mt-10 flex h-185 w-full flex-col items-center rounded-2xl border-2 border-gray-700! pb-10">
				<div class="mt-5 mb-5 self-center">
					<input placeholder="Find a verb to practice..." bind:value={filterInput} oninput={changeFilter} />
				</div>
				<div class="flex h-[90%] min-h-0 w-full flex-1 flex-col items-start overflow-auto bg-gray-700 p-5">
					{#if fullList.length !== 0}
						{#each list as verb, index}
							<button
								class="mt-2 flex w-full flex-col rounded-2xl border-2 border-olive-200 p-2 text-start text-blue-400 hover:cursor-pointer hover:bg-gray-200! hover:text-blue-800"
								onclick={() => {
									pushState(`/study/${verb.infinitive}`, { verb });
									selectedVerb = verb;
									selectedDefinition = verb.definitions[0].definition;
									selectedSubject = 'je';
									selectedTense = 'présent';
								}}
							>
								<span class="mt-4 font-bold">
									{#if verb.pronomial && ['a', 'e', 'é', 'i', 'o', 'u'].includes(verb.infinitive[0].toLowerCase())}
										<span class="text-pink-600">S'</span>
									{:else if verb.pronomial}
										<span class="text-pink-600">Se&nbsp;</span>
									{/if}{verb.infinitive}
								</span>

								<div class="flex w-full rounded-xl border-2 border-olive-200 bg-slate-400 p-3 text-neutral-900">
									<div class="ml-auto w-full">
										<div class="xs:text-[3vw] flex flex-col justify-between text-[17px]">
											{#each verb.definitions as d}
												<span class="flex justify-between pt-1"
													>{d.definition}
													<span class="text-violet-700">{d.subtype ? `${d.subtype}` : ''}</span></span
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
			<div class="mt-10 flex w-110 flex-col items-center justify-center rounded-2xl bg-neutral-300 xl:w-140">
				<div class="flex h-130 w-full flex-col items-center rounded-2xl bg-gray-200 p-3">
					<h1 class="flex-1">
						{#if selectedVerb.pronomial && ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(selectedVerb.infinitive[0])}
							<span class="text-pink-600">S'</span>
						{:else if selectedVerb.pronomial}
							<span class="text-pink-600">Se</span>
						{/if}
						{selectedVerb.infinitive}
					</h1>
					<div class="mb-5 flex w-full flex-6 flex-col items-center">
						<select bind:value={selectedDefinition} class="w-[80%] rounded-2xl">
							{#each selectedVerb.definitions as d}
								<option value={d.definition}>
									{d.definition}
									<span class="text-violet-700">{d.subtype ? `(${d.subtype})` : ''}</span>
								</option>
							{/each}
						</select>
						<div class="border-b border-b-mist-500 pb-2">
							<form class="mt-3 flex flex-col items-center gap-2">
								<div class="flex gap-4">
									<label for="je"><input bind:group={selectedSubject} name="subject" type="radio" id="je" value="je" checked class="mr-2" disabled={imperative} />je</label>

									<label for="tu"><input bind:group={selectedSubject} type="radio" id="tu" value="tu" class="mr-2" />tu</label>

									<label for="on"><input bind:group={selectedSubject} type="radio" id="on" value="on" class="mr-2" disabled={imperative} />on</label>

									<label for="vous"><input bind:group={selectedSubject} type="radio" id="vous" value="vous" class="mr-2" />vous</label>

									<label for="il"><input bind:group={selectedSubject} type="radio" id="il" value="il" class="mr-2" disabled={imperative} />il</label>
								</div>
								<div class="flex gap-5">
									<label for="elle"><input bind:group={selectedSubject} type="radio" id="elle" value="elle" class="mr-2" disabled={imperative} />elle</label>
									<label for="ils"><input bind:group={selectedSubject} type="radio" id="ils" value="ils" class="mr-2" disabled={imperative} />ils</label>

									<label for="elles"><input bind:group={selectedSubject} type="radio" id="elles" value="elles" class="mr-2" disabled={imperative} />elles</label>

									<label for="nous"><input bind:group={selectedSubject} type="radio" id="nous" value="nous" class="mr-2" />nous</label>
								</div>
							</form>
						</div>
						<div class="mt-7 flex w-full flex-1 flex-col items-center">
							<form class="flex w-full justify-between pr-5 pl-10 text-[15px] xl:pr-8 xl:pl-20">
								<div class="flex flex-col flex-wrap gap-2">
									<label for="présent"><input bind:group={selectedTense} name="subject" type="radio" id="présent" value="présent" class="mr-2" checked />présent</label>

									<label for="passé composé"><input bind:group={selectedTense} type="radio" id="passé composé" value="passé composé" class="mr-2" />passé composé</label>

									<label for="imparfait"><input bind:group={selectedTense} type="radio" id="imparfait" value="imparfait" class="mr-2" />imparfait</label>

									<label for="futur proche"><input bind:group={selectedTense} type="radio" id="futur proche" value="futur proche" class="mr-2" />futur proche</label>

									<label for="future simple"><input bind:group={selectedTense} type="radio" id="futur simple" value="futur simple" class="mr-2" />futur simple</label>
									<label for="subjonctif"><input bind:group={selectedTense} type="radio" id="subjonctif" value="subjonctif" class="mr-2" />subjonctif</label>
								</div>
								<div class="flex flex-col flex-wrap gap-2">
									<label for="conditionnel"> <input bind:group={selectedTense} type="radio" id="conditionnel" value="conditionnel" class="mr-2" />conditionnel</label>

									<label for="passé conditionnel"><input bind:group={selectedTense} type="radio" id="passé conditionnel" value="passé conditionnel" class="mr-2" />passé conditionnel</label>

									<label for="plus-que-parfait"><input bind:group={selectedTense} type="radio" id="plus-que-parfait" value="plus-que-parfait" class="mr-2" />plus-que-parfait</label>

									<label for="futur parfait"><input bind:group={selectedTense} type="radio" id="futur parfait" value="futur parfait" class="mr-2" />futur parfait</label>
									<label for="imperatif">
										<input
											bind:group={selectedTense}
											class="mr-2"
											type="radio"
											id="imperatif"
											value="imperatif"
											onclick={() => {
												if (selectedSubject !== 'tu' || selectedSubject !== 'nous' || selectedSubject !== 'vous') {
													selectedSubject = 'vous';
													console.log('forced subject chagne');
												}
											}}
										/>imperatif (tu/vous/nous)</label
									>
								</div>
							</form>
						</div>
					</div>
				</div>
				{#if generatedText !== ''}
					<div
						class={generateError === true ? 'text-red-800' : 'text-black' + ' m-4 h-full rounded-2xl border border-gray-400 bg-white p-3'}
						contenteditable="false"
						bind:innerText={generatedText}
					></div>
				{/if}
				{#if !generating}
					<button class="blue_button m-4 rounded-3xl! p-3! text-[19px]" onclick={generateSentence}>Generate Example</button>
				{:else}
					<div class="ellipsis-anim mt-4 mb-3 ml-6 text-[17px]"></div>
				{/if}
			</div>
		{/if}
	</div>
</div>
