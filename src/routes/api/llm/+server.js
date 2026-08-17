import { json } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { system, prompt, temperature } = await request.json();
		const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
			body: JSON.stringify({
				model: 'google/gemma-4-26b-a4b-it:free',
				messages: [
					{ role: 'system', content: system },
					{ role: 'user', content: prompt }
				],
				max_tokens: 130,
				temperature: temperature
			})
		});
		const data = await res.json();
		return json({ result: data.choices[0].message.content });
	} catch (error) {
		console.error('LLM fetch error: ', error);
		return json({ error: 'LLM request failed' }, { status: 500 });
	}
}
