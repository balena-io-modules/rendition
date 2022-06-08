import { JSONSchema7 as JSONSchema } from 'json-schema';
import { getPropertyRefScheme } from '../../extra/AutoUI/models/helpers';
import { randomString } from '../../utils';
import { FilterSignature } from '../Filters';
import { getJsonDescription } from './utils';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema) => 'is',
	},
	is_more_than: {
		getLabel: (_s: JSONSchema) => 'is more than',
	},
	is_less_than: {
		getLabel: (_s: JSONSchema) => 'is less than',
	},
};

type OperatorSlug = keyof typeof operators;

interface NumberFilter extends JSONSchema {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			type: 'number';
			const?: number;
			exclusiveMinimum?: number;
			exclusiveMaximum?: number;
		};
	};
}

export const decodeFilter = (filter: NumberFilter): FilterSignature | null => {
	const operator = filter.title;

	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	const refScheme = getPropertyRefScheme(filter)?.[0];
	if (!keys.length) {
		return null;
	}
	let value: number;

	const field = keys[0];

	if (operator === 'is') {
		value = filter.properties[field].const!;
	} else if (operator === 'is_more_than') {
		value = filter.properties[field].exclusiveMinimum!;
	} else if (operator === 'is_less_than') {
		value = filter.properties[field].exclusiveMaximum!;
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
): NumberFilter | JSONSchema => {
	const { title } = schema;
	const base: NumberFilter = {
		$id: randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			value,
			refScheme,
		),
		type: 'object',
		required: [field],
	};

	const val = typeof value === 'number' ? value : Number(value);

	if (operator === 'is') {
		const filter: JSONSchema = {
			type: 'number',
			const: val,
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

	if (operator === 'is_more_than') {
		const filter: JSONSchema = {
			type: 'number',
			exclusiveMinimum: val,
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

	if (operator === 'is_less_than') {
		const filter: JSONSchema = {
			type: 'number',
			exclusiveMaximum: val,
		};
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: filter,
					},
			  });
	}

	return base;
};
