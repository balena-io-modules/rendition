import { JSONSchema7 as JSONSchema } from 'json-schema';
import { getPropertyRefScheme } from '../../extra/AutoUI/models/helpers';
import { findInObject } from '../../extra/AutoUI/utils';
import { randomString, regexEscape } from '../../utils';
import { FilterSignature } from '../Filters';
import { FULL_TEXT_SLUG } from '../Filters/SchemaSieve';
import { getJsonDescription } from './utils';

export const operators = {
	contains: {
		getLabel: (_s: JSONSchema) => 'contains',
	},
	not_contains: {
		getLabel: (_s: JSONSchema) => 'does not contain',
	},
	is: {
		getLabel: (_s: JSONSchema) => 'is',
	},
	full_text_search: {
		getLabel: (_s: JSONSchema) => 'full text search',
	},
	matches_re: {
		getLabel: (_s: JSONSchema) => 'matches RegEx',
	},
	not_matches_re: {
		getLabel: (_s: JSONSchema) => 'does not match RegEx',
	},
};

type OperatorSlug = keyof typeof operators;

interface StringFilter extends JSONSchema {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			const?: string;
			pattern?: string;
			description?: string;
			not?: {
				pattern: string;
			};
		};
	};
	anyOf?: Array<{
		properties?: {
			[k: string]: {
				const?: string;
				pattern?: string;
				description?: string;
				not?: {
					pattern: string;
				};
				regexp?: {
					pattern: string;
					flags: string;
				};
			};
		};
	}>;
}

export const decodeFilter = (filter: StringFilter): FilterSignature | null => {
	const refScheme = getPropertyRefScheme(filter)?.[0];
	const operator = filter.title;
	let value: string;
	let field: string;

	if (filter.properties) {
		const keys = Object.keys(filter.properties);
		if (!keys.length) {
			return null;
		}

		field = keys[0];

		if (operator === 'is') {
			value = filter.properties[field].const!;
		} else if (operator === 'contains') {
			value = filter.properties[field].description!;
		} else if (operator === 'matches_re') {
			value = filter.properties[field].pattern!;
		} else {
			return null;
		}
	} else if (filter.anyOf) {
		if (filter.anyOf.length === 0 || !filter.anyOf[0].properties) {
			return null;
		}
		const keys = Object.keys(filter.anyOf[0].properties!);
		if (!keys.length) {
			return null;
		}

		field = keys[0];

		if (operator === 'not_contains') {
			value = filter.anyOf[0].properties![field].description!;
		} else if (operator === 'not_matches_re') {
			value = filter.anyOf[0].properties![field].not!.pattern;
		} else if (operator === FULL_TEXT_SLUG) {
			return {
				field: 'any',
				operator,
				value:
					findInObject(filter.anyOf[0].properties, 'description') ??
					findInObject(filter.anyOf[0].properties, 'pattern') ??
					findInObject(filter.anyOf[0].properties, 'const'),
			};
		} else {
			return null;
		}
	} else {
		return null;
	}

	return {
		field,
		operator,
		value,
		refScheme,
	};
};

export const createFilter = (
	field: string,
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema,
	recursive: boolean = false,
	refScheme?: string | null,
): JSONSchema => {
	const { title } = schema;
	const base: StringFilter = {
		$id: randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			value,
			refScheme,
		),
		type: 'object',
	};

	if (operator === 'is') {
		const filter = {
			title,
			const: value,
		};
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: filter,
					},
					required: [field],
			  });
	}

	if (operator === 'contains') {
		const filter = {
			regexp: {
				pattern: regexEscape(value),
				flags: 'i',
			},
		} as JSONSchema;
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: {
							type: 'string',
							description: value,
							...filter,
						},
					},
					required: [field],
			  });
	}

	if (operator === 'not_contains') {
		const filter = [
			{
				type: 'string',
				description: value,
				not: {
					regexp: {
						pattern: regexEscape(value),
						flags: 'i',
					},
				},
			},
			{
				type: 'null',
			},
		] as JSONSchema[];
		if (recursive) {
			return {
				anyOf: filter,
			};
		}
		return Object.assign(base, {
			anyOf: [
				{
					properties: {
						[field]: filter[0],
					},
				},
				{
					properties: {
						[field]: filter[1],
					},
				},
			],
		});
	}

	if (operator === 'matches_re') {
		const filter = {
			type: 'string',
			pattern: value,
		} as JSONSchema;
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: filter,
					},
					required: [field],
			  });
	}

	if (operator === 'not_matches_re') {
		const filter = [
			{
				type: 'string',
				not: {
					pattern: value,
				},
			},
			{
				type: 'null',
			},
		] as JSONSchema[];
		if (recursive) {
			return {
				anyOf: filter,
			};
		}
		return Object.assign(base, {
			anyOf: [
				{
					properties: {
						[field]: filter[0],
					},
				},
				{
					properties: {
						[field]: filter[1],
					},
				},
			],
		});
	}

	return base;
};
