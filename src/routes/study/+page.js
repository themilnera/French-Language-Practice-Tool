import { json } from '@sveltejs/kit';
export const load = async ({ fetch, params }) => {
	const response = await fetch(`/api/verb`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const verbs = await response.json();
	return { verbs };
};
