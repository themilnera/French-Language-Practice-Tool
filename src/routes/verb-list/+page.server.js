export const actions = {
	add: async ({ request, fetch }) => {
		const data = await request.formData();
		const infinitive = data.get('infinitive');
		const pronomial = data.get('pronomial');
		const subtype = data.get('subtype');
		const definition = data.get('definition');
		await fetch(`/api/verb`, {
			method: 'POST',
			body: JSON.stringify({
				infinitive: infinitive,
				pronomial: pronomial,
				subtype: subtype,
				definition: definition
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');
		const infinitive = data.get('infinitive');
		const pronomial = data.get('pronomial');
		const subtype = data.get('subtype');
		const definition = data.get('definition');
		await fetch(`/api/verb`, {
			method: 'PUT',
			body: JSON.stringify({
				infinitive: infinitive,
				pronomial: pronomial,
				subtype: subtype,
				definition: definition,
				id: id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');
		await fetch(`/api/verb`, {
			method: 'DELETE',
			body: JSON.stringify({
				id: id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
