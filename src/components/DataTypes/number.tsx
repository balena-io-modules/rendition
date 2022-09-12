import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_not: 'is not',
	is_more_than: 'is more than',
	is_less_than: 'is less than',
});

export type OperatorSlug = keyof ReturnType<typeof operators>;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
) => {
	const operatorSlug = operator.slug;

	const val = typeof value === 'number' ? value : Number(value) || undefined;

	if (val == null) {
		return {};
	}

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					type: 'number',
					const: val,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_not') {
		return {
			properties: {
				[field]: {
					type: 'number',
					not: {
						const: val,
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_more_than') {
		return {
			properties: {
				[field]: {
					type: 'number',
					exclusiveMinimum: val,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_less_than') {
		return {
			properties: {
				[field]: {
					type: 'number',
					exclusiveMaximum: val,
				},
			},
			required: [field],
		};
	}

	return {};
};
