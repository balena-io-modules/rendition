import { JSONSchema7 as JSONSchema } from 'json-schema';
import { getPropertyRefScheme } from '../../extra/AutoUI/models/helpers';
import { randomString } from '../../utils';
import { getJsonDescription } from './utils';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema) => 'is',
	},
	is_not: {
		getLabel: (_s: JSONSchema) => 'is not',
	},
};

type OperatorSlug = keyof typeof operators;

interface EnumFilter extends JSONSchema {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			const?: any;
			not?: {
				const?: any;
			};
		};
	};
}

export const decodeFilter = (
	filter: EnumFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: any;
	refScheme?: string;
} | null => {
	const operator = filter.title;

	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	if (!keys.length) {
		return null;
	}
	let value: string;

	const field = keys[0];
	const refScheme = getPropertyRefScheme(filter)?.[0];

	if (operator === 'is') {
		value = filter.properties[field].const;
	} else if (operator === 'is_not') {
		value = filter.properties[field].not!.const;
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
	refScheme?: string,
): EnumFilter | JSONSchema => {
	const { title } = schema;
	const base: EnumFilter = {
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

	if (operator === 'is_not') {
		const filter = {
			not: {
				const: value,
			},
		};
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: {
							not: {
								const: value,
							},
						},
					},
			  });
	}

	return base;
};
