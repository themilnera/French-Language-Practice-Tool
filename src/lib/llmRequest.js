export default async function llmRequest(url, model, system, prompt, temperature, num_predict) {
	try {
		const res = await fetch(`http://${url}/api/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: model,
				prompt: prompt,
				system: system,
				stream: false,
				options: { temperature: temperature }
			})
		});
		const data = await res.json();
		return data.response;
	} catch (error) {
		return error;
	}
}
