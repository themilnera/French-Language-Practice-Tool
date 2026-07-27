<script>
	import { pushState } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

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
</script>

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
	<div class="flex flex-col items-center justify-center">
		<div class="mt-10 flex h-100 w-[80%] flex-col items-center rounded-2xl bg-red-50 p-3">
			<h1 class="flex-1">{selectedVerb.infinitive}</h1>
			<div class="w-full flex-6">
				<select bind:value={selectedDefinition}>
					{#each selectedVerb.definitions as d}
						<option value={d.definition}>
							{d.definition}
							<span class="text-violet-700">{d.subtype ? `(${d.subtype})` : ''}</span>
						</option>
					{/each}
				</select>
				<div class="flex-1">
					<form>
						<input
							bind:group={selectedSubject}
							name="subject"
							type="radio"
							id="je"
							value="je"
							checked
						/>
						<label for="je">je</label>

						<input bind:group={selectedSubject} type="radio" id="tu" value="tu" />
						<label for="tu">tu</label>

						<input bind:group={selectedSubject} type="radio" id="on" value="on" />
						<label for="on">on</label>

						<input bind:group={selectedSubject} type="radio" id="vous" value="vous" />
						<label for="vous">vous</label>

						<input bind:group={selectedSubject} type="radio" id="il" value="il" />
						<label for="il">il</label>

						<input bind:group={selectedSubject} type="radio" id="elle" value="elle" />
						<label for="elle">elle</label>

						<input bind:group={selectedSubject} type="radio" id="ils" value="ils" />
						<label for="ils">ils</label>

						<input bind:group={selectedSubject} type="radio" id="elles" value="elles" />
						<label for="elles">elles</label>

						<input bind:group={selectedSubject} type="radio" id="nous" value="nous" />
						<label for="nous">nous</label>
					</form>
				</div>
				<div class="mt-10 flex-1">
					<form>
						<input
							bind:group={selectedTense}
							name="subject"
							type="radio"
							id="présent"
							value="présent"
							checked
						/>
						<label for="présent">présent</label>

						<input
							bind:group={selectedTense}
							type="radio"
							id="passé composé"
							value="passé composé"
						/>
						<label for="passé composé">passé composé</label>

						<input bind:group={selectedTense} type="radio" id="imparfait" value="imparfait" />
						<label for="imparfait">imparfait</label>

						<input bind:group={selectedTense} type="radio" id="futur proche" value="futur proche" />
						<label for="futur proche">futur proche</label>

						<input bind:group={selectedTense} type="radio" id="futur simple" value="futur simple" />
						<label for="future simple">futur simple</label>

						<input bind:group={selectedTense} type="radio" id="subjonctif" value="subjonctif" />
						<label for="subjonctif">subjonctif</label>

						<input bind:group={selectedTense} type="radio" id="conditionnel" value="conditionnel" />
						<label for="conditionnel">conditionnel</label>

						<input
							bind:group={selectedTense}
							type="radio"
							id="passé conditionnel"
							value="passé conditionnel"
						/>
						<label for="passé conditionnel">passé conditionnel</label>

						<input
							bind:group={selectedTense}
							type="radio"
							id="plus-que-parfait"
							value="plus-que-parfait"
						/>
						<label for="plus-que-parfait">plus-que-parfait (past perfect)</label>
						<input
							bind:group={selectedTense}
							type="radio"
							id="futur parfait"
							value="futur parfait"
						/>
						<label for="futur parfait">futur parfait</label>
						<input bind:group={selectedTense} type="radio" id="imperatif" value="imperatif" />
						<label for="imperatif">imperatif</label>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
