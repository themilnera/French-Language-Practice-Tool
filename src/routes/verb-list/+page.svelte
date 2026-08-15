<script>
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
	let verbs = $derived(data?.verbs?.sort((a, b) => a.infinitive.localeCompare(b.infinitive)));

	let infinitive = $state('');
	let definition = $state('');
	let selected = $state(null);
	let submitting = $state(false);

	let subtype = $state('');
	let pronomial = $state(false);

	/**@type {HTMLDivElement} */
	let verbDiv = $state(null);

	/**@type {HTMLInputElement}*/
	let defInput = $state(null);

	let preserve = $state(false);

	function resetFields() {
		if (!preserve) infinitive = '';
		definition = '';
		selected = null;
		subtype = '';
		pronomial = false;
	}

	function getSelectedClasses(verb) {
		if (selected?.definition === verb?.definition) {
			return 'flex! w-full justify-between!  text-[3vw] text-white! md:text-lg bg-red-700! hover:bg-red-800! text-shadow-gray-400';
		} else return 'flex! w-full justify-between!  text-[3vw] text-black! md:text-lg bg-red-200! hover:bg-red-300!';
	}
	function getSubtypeClasses(verb) {
		if (selected?.definition === verb?.definition) {
			return 'text-violet-300 font-extrabold text-shadow-sm text-shadow-gray-400';
		} else return 'text-violet-700';
	}

	function handleSubmit() {
		submitting = true;
		const scrollTop = verbDiv?.scrollTop;
		console.log(scrollTop);
		return async ({ update }) => {
			await update({ reset: false });
			await tick();
			if (verbDiv) verbDiv.scrollTop = scrollTop;
			resetFields();
			submitting = false;
			defInput.focus();
		};
	}
</script>

<!-- 
<div class="flex h-screen flex-col justify-center bg-amber-50 md:flex-row-reverse">
	<div
		class="flex min-h-0 w-full flex-1 flex-col items-start overflow-auto border-b-2 bg-red-50 p-5 md:border-l-2"
		bind:this={verbDiv}
	>
		{#if verbs}
			{#each verbs as verb, index}
				<div class="flex self-center">
					{#if index == 0 || verb.infinitive !== verbs[index - 1].infinitive}
						{#if verb.pronomial && ['a', 'e', 'é', 'i', 'o', 'u'].includes(verb.infinitive.toLowerCase()[0])}
							<p class="mt-2 text-cyan-400">S'</p>
						{/if}
						<p class="mt-2 font-bold text-blue-800">{verb.infinitive}</p>
					{/if}
				</div>
				<div class="flex w-full bg-red-200 pt-1 pr-3 pb-1 pl-3">
					<div class="ml-auto w-full">
						<button
							onclick={() => {
								if (selected?.definition === verb.definition) {
									resetFields();
								} else {
									selected = verb;
									infinitive = verb.infinitive;
									subtype = verb.subtype;
									pronomial = verb.pronomial;
									definition = verb.definition;
								}
							}}
							class={getSelectedClasses(verb)}
						>
							<p class="text-left">{verb.definition}</p>
							<p class={getSubtypeClasses(verb)}>
								{verb.subtype ? `${verb.subtype}` : ''}
							</p>
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="flex w-full flex-1 justify-center bg-amber-50 pt-10 md:pt-50">
		<div class="w-[70%] rounded-2xl pb-5">
			<form use:enhance={handleSubmit} method="POST" class="flex flex-col gap-3">
				<h1 class="self-center">Verb:</h1>
				<label class="flex items-center justify-between text-lg"
					>Infinitive:
					<input name="infinitive" class="ml-4 h-8 w-full" bind:value={infinitive} />
					<input class="ml-2 rounded-sm!" type="checkbox" bind:checked={preserve} />
				</label>
				<label class="flex flex-col items-center justify-between text-lg"
					>Definition:
					<input
						name="definition"
						class="ml-2 h-8 w-full"
						bind:value={definition}
						bind:this={defInput}
					/>
				</label>
				<div class="flex items-center justify-between gap-8">
					<div class="flex items-center">
						<label class="flex items-center justify-between text-lg"
							>Pronomial:
							<input
								type="checkbox"
								name="pronomial"
								class="checkbox ml-3"
								bind:checked={pronomial}
							/>
						</label>
					</div>
					<label class="flex items-center gap-2 text-lg"
						>Subtype:
						<select name="subtype" class="rounded-2xl" bind:value={subtype}>
							<option value="">None</option>
							<option value="technical">Technical</option>
							<option value="idiomatic">Idiomatic</option>
							<option value="reflexive">Reflexive</option>
							<option value="reciprocal">Reciprocal</option>
							<option value="figurative">Figurative</option>
							<option value="informal">Informal</option>
						</select>
					</label>
				</div>
				<label class="flex items-center justify-between text-lg"
					>Id:
					<input name="id" class="ml-2 h-8 w-full" readonly value={selected?.id} />
				</label>
				{#if !selected}
					{#if !submitting}
						<button
							class="mt-5 w-[50%] self-center"
							type="submit"
							formaction="?/add"
							disabled={submitting}>Submit</button
						>
					{:else}
						<div class="small_loader"></div>
					{/if}
				{:else}
					<div class="flex gap-5">
						{#if !submitting}
							<button
								disabled={submitting}
								class="mt-5 w-[50%] self-center bg-cyan-700! hover:bg-cyan-800!"
								type="submit"
								formaction="?/update">Update</button
							>
							<button
								class="red_button mt-5 w-[50%] self-center"
								type="submit"
								formaction="?/delete"
								disabled={submitting}>Delete</button
							>
						{:else}
							<div class="small_loader"></div>
						{/if}
					</div>
				{/if}
			</form>
		</div>
	</div>
</div> -->
