import memoize from 'lodash/memoize';

export const getDefaultDate = (): string => {
	const date = new Date();
	return date.toISOString().split('.')[0];
};

// Normalize a timestamp to a RFC3339 timestamp, which is required for JSON schema.
export const normalizeDateTime = memoize((timestamp: string) => {
	const d = new Date(timestamp);
	if (isNaN(d.getTime())) {
		return null;
	}
	// Remove miliseconds
	return d.toISOString().split('.')[0] + 'Z';
});
