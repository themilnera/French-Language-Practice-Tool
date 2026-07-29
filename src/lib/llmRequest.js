export default async function llmRequest(url, model, system, prompt, temperature, num_predict) {
	try {
		const res = await fetch(`http://${url}/api/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: model,
				prompt: prompt,
				stream: false,
				options: { temperature: temperature }
			})
		});
		const data = await res.json();
		console.log(data);
		return data.response;
	} catch (error) {
		console.error('Failed to fetch from LLM: ' + error);
	}
}
