export const actions = {
	default: async ({ request, fetch }) => {
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
	}
};
