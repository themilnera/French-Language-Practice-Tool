<script>
	import { onMount } from 'svelte';

	let { data } = $props();
</script>

<div class="flex h-screen flex-col justify-center bg-amber-50 md:flex-row-reverse">
	<div
		class="flex min-h-0 w-full flex-1 flex-col items-start overflow-auto border-b-2 bg-red-50 p-5 md:border-l-2"
	>
		{#if data.verbs}
			{#each data.verbs as item, index}
				<div class="flex self-center">
					{#if index == 0 || item.infinitive !== data.verbs[index - 1].infinitive}
						{#if item.pronomial && ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(item.infinitive[0])}
							<p class="text-cyan-400">S'</p>
						{/if}
						<p class="font-bold text-blue-800">{item.infinitive}</p>
					{/if}
				</div>
				<div class="flex w-full bg-red-200 pt-1 pr-3 pb-1 pl-3">
					<div class="ml-auto w-full">
						<div class="flex justify-between text-[3vw] md:text-lg">
							<p class="">{item.definition}</p>
							<p class="text-violet-700">{item.subtype ? `${item.subtype}` : ''}</p>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="flex w-full flex-1 justify-center bg-amber-50 pt-10 md:pt-50">
		<div class="w-[70%] rounded-2xl pb-5">
			<form method="POST" class="flex flex-col gap-3">
				<h1 class="self-center">Verb:</h1>
				<label class="flex items-center justify-between text-lg"
					>Infinitive:
					<input name="infinitive" class="ml-4 h-8 w-full" />
				</label>
				<label class="flex flex-col items-center justify-between text-lg"
					>Definition:
					<input name="definition" class="ml-2 h-8 w-full" />
				</label>
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<label class="flex items-center justify-between text-lg"
							>Pronomial?
							<input type="checkbox" name="pronomial" class="checkbox ml-3" />
						</label>
					</div>
					<label class="flex items-center gap-2 text-lg"
						>Subtype
						<select name="subtype" class="rounded-2xl">
							<option value="">None</option>
							<option value="technical">Technical</option>
							<option value="idiomatic">Idiomatic</option>
							<option value="reflexive">Reflexive</option>
							<option value="reciprocal">Reciprocal</option>
						</select>
					</label>
				</div>
				<button class="red_button mt-5 w-[50%] self-center" type="submit">Submit</button>
			</form>
		</div>
	</div>
</div>
