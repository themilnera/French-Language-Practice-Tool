<script>
	import { onMount } from 'svelte';

	let { data } = $props();
	let verbs = $derived(data?.verbs?.sort((a, b) => a.infinitive.localeCompare(b.infinitive)));
	let infinitive = $state('');
	let definition = $state('');
	let selected = $state(null);
	let subtype = $state('');
	let pronomial = $state(false);
</script>

<div class="flex h-screen flex-col justify-center bg-amber-50 md:flex-row-reverse">
	<div
		class="flex min-h-0 w-full flex-1 flex-col items-start overflow-auto border-b-2 bg-red-50 p-5 md:border-l-2"
	>
		{#if verbs}
			{#each verbs as verb, index}
				<div class="flex self-center">
					{#if index == 0 || verb.infinitive !== verbs[index - 1].infinitive}
						{#if verb.pronomial && ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(verb.infinitive[0])}
							<p class="text-cyan-400">S'</p>
						{/if}
						<p class="font-bold text-blue-800">{verb.infinitive}</p>
					{/if}
				</div>
				<div class="flex w-full bg-red-200 pt-1 pr-3 pb-1 pl-3">
					<div class="ml-auto w-full">
						<button
							onclick={() => {
								if (selected === verb) {
									selected = null;
									infinitive = '';
									subtype = '';
									pronomial = false;
									definition = '';
								} else {
									selected = verb;
									infinitive = verb.infinitive;
									subtype = verb.subtype;
									pronomial = verb.pronomial;
									definition = verb.definition;
								}
							}}
							class="flex! w-full justify-between! bg-red-200! text-[3vw] text-black! hover:bg-red-300! md:text-lg"
						>
							<p class="text-left">{verb.definition}</p>
							<p class="text-violet-700">{verb.subtype ? `${verb.subtype}` : ''}</p>
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="flex w-full flex-1 justify-center bg-amber-50 pt-10 md:pt-50">
		<div class="w-[70%] rounded-2xl pb-5">
			<form use:enhance method="POST" class="flex flex-col gap-3">
				<h1 class="self-center">Verb:</h1>
				<label class="flex items-center justify-between text-lg"
					>Infinitive:
					<input name="infinitive" class="ml-4 h-8 w-full" bind:value={infinitive} />
				</label>
				<label class="flex flex-col items-center justify-between text-lg"
					>Definition:
					<input name="definition" class="ml-2 h-8 w-full" bind:value={definition} />
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
					<button class="mt-5 w-[50%] self-center" type="submit" formaction="?/add">Submit</button>
				{:else}
					<button
						class="mt-5 w-[50%] self-center bg-cyan-700! hover:bg-cyan-800!"
						type="submit"
						formaction="?/update">Update</button
					>
				{/if}
			</form>
		</div>
	</div>
</div>
