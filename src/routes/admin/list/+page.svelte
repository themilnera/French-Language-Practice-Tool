<script>
	import { onMount } from 'svelte';

	let { data } = $props();
</script>

<div class="mt-10 flex h-full w-full flex-col items-center justify-center bg-olive-300">
	{#if data.verbs}
		{#each data.verbs as item, index}
			<div class="mt-3">
				{#if index == 0 || item.infinitive !== data.verbs[index - 1].infinitive}
					<p>{item.pronomial ? '(Se) ' : ''}</p>
					<p class="text-2xl font-bold text-blue-800">{item.infinitive}</p>
				{/if}
			</div>
			<div class="flex w-[40%] gap-2">
				<div class="ml-auto">
					<div class="w-100 rounded-lg border-2 bg-amber-100 p-2">
						<p class="text-violet-700">{item.subtype ? `(${item.subtype})` : ''}</p>
						<p>{item.definition}</p>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
