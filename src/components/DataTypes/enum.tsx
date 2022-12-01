import { regexEscape } from '../../utils/index';
import { FULL_TEXT_SLUG } from '../Filters/SchemaSieve';
import type { CreateFilter } from './utils';

export const operators = () => ({
	is: 'is',
	is_not: 'is not',
});

export type OperatorSlug =
	| keyof ReturnType<typeof operators>
	| typeof FULL_TEXT_SLUG;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
) => {
	const operatorSlug = operator.slug;

	if (operatorSlug === FULL_TEXT_SLUG && typeof value === 'string') {
		return {
			properties: {
				[field]: {
					type: 'string',
					// Note: An alternative could be to do: { enum: subSchema.enum.filter(x => x.toLowerCase().includes(value.toLowerCase())) }
					regexp: {
						pattern: regexEscape(value),
						flags: 'i',
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'is' || operatorSlug === FULL_TEXT_SLUG) {
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
