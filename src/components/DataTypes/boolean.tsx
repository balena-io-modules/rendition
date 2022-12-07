import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
});

export type OperatorSlug = keyof ReturnType<typeof operators> | 'is_not';

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
) => {
	const operatorSlug = operator.slug;

	const val =
		typeof value === 'string' ? value.toLowerCase() === 'true' : value;

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
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
					not: {
						const: val,
					},
				},
			},
			required: [field],
		};
	}
	return {};
};

export const uiSchema = () => ({
	'ui:widget': 'select',
});
