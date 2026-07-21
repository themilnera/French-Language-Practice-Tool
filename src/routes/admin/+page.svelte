<script>
</script>

<div class="m-0 flex h-svh items-center justify-center">
	<form method="POST" class="flex w-[40%] flex-col gap-10">
		<h1 class="self-center">Add a verb</h1>
		<label class="flex justify-between"
			>Infinitive
			<input name="infinitive" />
		</label>
		<label class="flex justify-between"
			>Pronomial
			<input type="checkbox" name="pronomial" class="ml-auto" />
		</label>
		<label class="flex justify-between"
			>Definition
			<input name="definition" />
		</label>
		<label class="flex justify-between"
			>Subtype
			<select name="subtype">
				<option value="">None</option>
				<option value="technical">Technical</option>
				<option value="idiomatic">Idiomatic</option>
				<option value="reflexive">Reflexive</option>
				<option value="reciprocal">Reciprocal</option>
			</select>
		</label>
		<button class="w-[50%] self-center" type="submit">Submit</button>
	</form>
</div>
