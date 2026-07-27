<script>
	import { onMount } from 'svelte';

	let { data } = $props();
	let filterInput = $state('');
	let filter = $derived(removeAccents(filterInput.trim().toLowerCase()));
	let fullList = $derived(deriveList(data?.verbs) ?? []);
	let list = $derived(fullList ?? []);

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
				<div
					class="mt-2 flex w-full flex-col rounded-2xl p-2 text-start hover:cursor-pointer hover:bg-gray-200"
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
				</div>
			{/each}
		{/if}
	</div>
</div>
