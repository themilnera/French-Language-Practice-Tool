export function deriveList(initialList) {
	initialList.sort((a, b) => {
		if (a.infinitive === b.infinitive && a.pronomial && !b.pronomial) {
			return 1;
		} else if (a.infinitive === b.infinitive && !a.pronomial && b.pronomial) {
			return -1;
		} else {
			return 0;
		}
	}); //sorting just in case so that all the pronomials are together

	let list = [];
	let infinitive = '';
	let pronomial = false;
	let subtype = '';
	let definitions = [];

	for (let i = 0; i < initialList.length; i++) {
		let currentVerb = initialList[i];
		let lastVerb = null;
		if (i > 0) {
			lastVerb = initialList[i - 1];
		}
		if (
			//first row, or new infinitive, or new pronomial version
			!lastVerb ||
			currentVerb.infinitive !== lastVerb.infinitive ||
			(currentVerb.infinitive === lastVerb.infinitive &&
				currentVerb.pronomial !== lastVerb.pronomial)
		) {
			if (lastVerb) {
				list.push({ infinitive, pronomial, subtype, definitions });
			}
			infinitive = currentVerb.infinitive;
			pronomial = currentVerb.pronomial;
			definitions = [{ definition: currentVerb.definition, subtype: currentVerb.subtype }];
		} else if (
			currentVerb.infinitive === lastVerb.infinitive &&
			currentVerb.pronomial === lastVerb.pronomial
		) {
			definitions.push({
				definition: initialList[i].definition,
				subtype: initialList[i].subtype
			});
		}
	}
	list.push({ infinitive, pronomial, subtype, definitions });

	return list;
}
