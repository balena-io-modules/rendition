import memoize = require('lodash/memoize');
import * as moment from 'moment';

const pad = (n: number) => (n < 10 ? `0${n}` : n);

export const getDefaultDate = (): string => {
	const now = new Date();
	const day = pad(now.getDate());
	const month = pad(now.getMonth() + 1);
	return `${now.getFullYear()}-${month}-${day}T10:00`;
};

// Normalize a timestamp to a RFC3339 timestamp, which is required for JSON
// schema.
export const normalizeDateTimeNew = memoize((timestamp: string) => {
	const d = new Date(timestamp);
	if (isNaN(d.getTime())) {
		return 'Invalid date';
	}
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
		d.getUTCDate(),
	)}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
		d.getUTCSeconds(),
	)}Z`;
});

export const normalizeDateTime = memoize((timestamp: string) =>
	moment(timestamp)
		.utc()
		.format(),
);
