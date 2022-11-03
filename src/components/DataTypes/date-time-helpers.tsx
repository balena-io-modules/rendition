import memoize from 'lodash/memoize';

export const getDefaultDate = (): string => {
	const date = new Date();
	return date.toISOString().split('.')[0];
};

// Normalize a timestamp to a RFC3339 timestamp, which is required for JSON schema.
export const normalizeDateTime = memoize(
	(timestamp: string | number, type?: 'string' | 'number') => {
		const d = new Date(timestamp);
		if (isNaN(d.getTime())) {
			return null;
		}
		return type === 'number'
			? d.getTime()
			: d.toISOString().split('.')[0] + 'Z'; // Remove miliseconds;
	},
);
