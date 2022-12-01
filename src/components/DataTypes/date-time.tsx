import { normalizeDateTime } from './date-time-helpers';
import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_before: 'is before',
	is_after: 'is after',
});

export type OperatorSlug = keyof ReturnType<typeof operators> | 'is_not';

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
	schema,
) => {
	const operatorSlug = operator.slug;
	const { type } = schema;
	const normalizedValue = normalizeDateTime(value, type as 'string' | 'number');
	if (value != null && normalizedValue == null) {
		return {};
	}

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					type: type ?? 'string',
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
					type: type ?? 'string',
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
		const rule =
			type === 'number'
				? { exclusiveMaximum: normalizedValue as number }
				: { formatMaximum: normalizedValue };
		return {
			properties: {
				[field]: {
					type: type ?? 'string',
					format: 'date-time',
					...rule,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_after') {
		const rule =
			type === 'number'
				? { exclusiveMinimum: normalizedValue as number }
				: { formatMinimum: normalizedValue };
		return {
			properties: {
				[field]: {
					type: type ?? 'string',
					format: 'date-time',
					...rule,
				},
			},
			required: [field],
		};
	}

	return {};
};
