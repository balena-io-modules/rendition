import memoize = require('lodash/memoize');

export const getDefaultDate = (): string => {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0);
	return date.toISOString().split('.')[0] + 'Z';
};

// Normalize a timestamp to a RFC3339 timestamp, which is required for JSON schema.
export const normalizeDateTime = memoize((timestamp: string) => {
	const d = new Date(timestamp);
	if (isNaN(d.getTime())) {
		return 'Invalid date';
	}
	// Remove miliseconds
	return d.toISOString().split('.')[0] + 'Z';
});
