import { regexEscape } from '../../utils';
import { FULL_TEXT_SLUG } from '../Filters/SchemaSieve';
import type { CreateFilter } from './utils';

export const operators = () => ({
	contains: 'contains',
	not_contains: 'does not contain',
	is: 'is',
	is_not: 'is not',
	matches_re: 'matches RegEx',
	not_matches_re: 'does not match RegEx',
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

	if (operatorSlug === 'contains' || operatorSlug === FULL_TEXT_SLUG) {
		return {
			properties: {
				[field]: {
					type: 'string',
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
						type: 'string',
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
