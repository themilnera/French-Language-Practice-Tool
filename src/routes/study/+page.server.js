import { getCached } from '$lib/cache.js';
import { json } from '@sveltejs/kit';
export const load = async ({ fetch, params }) => {
	const data = await getCached('verbs', async () => {
		const response = await fetch(`/api/verb`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	});

	return { verbs: data };
};
