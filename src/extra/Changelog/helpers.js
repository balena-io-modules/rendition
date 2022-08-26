import { isBefore } from 'date-fns'

export default (data) => {
	const untilDate = new Date(new Date().setDate(new Date().getDate() - 90));
	const versionDateStringMatches =
		data.match(
			/^# v\d+\.\d+\.\d+\n## \(([0-9]{4}-[0-1][0-9]-[0-3][0-9])\)/gm
		) ?? [];
	let firstOlderDateIndex = Infinity;
	let foundMatch = false;
	for (let i = 0; i < versionDateStringMatches.length; i++) {
		foundMatch = true;
		const firstOlderDateString = versionDateStringMatches[i];
		if (isBefore(new Date(firstOlderDateString.split('(')[1].split(')')[0]), untilDate)) {
			firstOlderDateIndex = i;
			break;
		}
	}
	if (!foundMatch) {
		throw new Error(
			"Could not find any changes from the last 90 days in the changelog"
		);
	}
	const firstVersionIndex = data.search(/# v\d+\.\d+\.\d+/);
	const lastVersionIndex = data.indexOf(versionDateStringMatches[i])
	return data.slice(firstVersionIndex, lastVersionIndex);
};
