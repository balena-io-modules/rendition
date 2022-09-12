import { regexEscape } from '../../utils';
import type { CreateFilter } from './utils';

export const operators = () => ({
	contains: 'contains',
	not_contains: 'does not contain',
	is: 'is',
	is_not: 'is not',
	full_text_search: 'full text search',
	matches_re: 'matches RegEx',
	not_matches_re: 'does not match RegEx',
});

export type OperatorSlug = keyof ReturnType<typeof operators>;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
): ReturnType<CreateFilter<OperatorSlug>> => {
	const operatorSlug = operator.slug;

	if (operatorSlug === 'is') {
		return {
			properties: {
				[field]: {
					type: 'string',
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
					type: 'string',
					not: {
						const: value,
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'contains') {
		return {
			properties: {
				[field]: {
					type: 'string',
					// @ts-expect-error
					regexp: {
						pattern: regexEscape(value),
						flags: 'i',
					},
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'not_contains') {
		return {
			properties: {
				[field]: {
					not: {
						// @ts-expect-error
						regexp: {
							pattern: regexEscape(value),
							flags: 'i',
						},
					},
				},
			},
		};
	}

	if (operatorSlug === 'matches_re') {
		return {
			properties: {
				[field]: {
					type: 'string',
					pattern: value,
				},
			},
			required: [field],
		};
	}

	if (operatorSlug === 'not_matches_re') {
		return {
			properties: {
				[field]: {
					type: 'string',
					not: {
						pattern: value,
					},
				},
			},
		};
	}

	return {};
};
