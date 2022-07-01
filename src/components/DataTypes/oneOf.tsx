import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_not: 'is not',
});

export type OperatorSlug = keyof ReturnType<typeof operators>;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
) => {
	const operatorSlug = operator.slug;

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					const: value,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is_not') {
		return {
			properties: {
				[field]: {
					not: {
						const: value,
					},
				},
			},
		};
	}

	return {};
};
