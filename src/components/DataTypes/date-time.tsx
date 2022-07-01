import { normalizeDateTime } from './date-time-helpers';
import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_before: 'is before',
	is_after: 'is after',
});

export type OperatorSlug = keyof ReturnType<typeof operators>;

export const createFilter: CreateFilter<OperatorSlug | 'is_not'> = (
	field,
	operator,
	value,
) => {
	const operatorSlug = operator.slug;

	const normalizedValue = normalizeDateTime(value);

	if (value != null && normalizedValue == null) {
		return {};
	}

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					const: normalizedValue,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_not') {
		return {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					not: {
						const: normalizedValue,
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_before') {
		return {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					formatMaximum: normalizedValue,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_after') {
		return {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					formatMinimum: normalizedValue,
				},
			},
			required: [field],
		};
	}

	return {};
};
