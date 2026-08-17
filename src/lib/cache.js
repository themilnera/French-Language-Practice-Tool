const store = new Map();
const duration = 1000 * 60 * 1440;

export async function getCached(key, fetchFunction) {
	const cached = store.get(key);
	let now = Date.now();
	if (cached && now - cached.time < duration) {
		return cached.data;
	}
	const data = await fetchFunction();
	store.set(key, { data, time: now });
	return data;
}
