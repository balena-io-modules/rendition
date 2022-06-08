import { JSONSchema7 as JSONSchema } from 'json-schema';
import { getPropertyRefScheme } from '../../extra/AutoUI/models/helpers';
import { randomString } from '../../utils';
import { FilterSignature } from '../Filters';
import { normalizeDateTime } from './date-time-helpers';
import { getJsonDescription } from './utils';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema) => 'is',
	},
	is_before: {
		getLabel: (_s: JSONSchema) => 'is before',
	},
	is_after: {
		getLabel: (_s: JSONSchema) => 'is after',
	},
};

type OperatorSlug = keyof typeof operators;

interface DateTimeFilter extends JSONSchema {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			type: 'string';
			format: 'date-time';
			const: string;
			formatMaximum?: string;
			formatMinimum?: string;
		};
	};
}

export const decodeFilter = (
	filter: DateTimeFilter,
): FilterSignature | null => {
	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	if (!keys.length) {
		return null;
	}

	const field = keys[0];
	const refScheme = getPropertyRefScheme(filter)?.[0];
	const operator = filter.title;
	let value: string;

	if (operator === 'is') {
		value = filter.properties[field].const!;
	} else if (operator === 'is_before') {
		value = filter.properties[field].formatMaximum!;
	} else if (operator === 'is_after') {
		value = filter.properties[field].formatMinimum!;
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
): DateTimeFilter | JSONSchema => {
	const { title } = schema;
	const base: DateTimeFilter = {
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

	const normalizedValue = normalizeDateTime(value);

	if (operator === 'is') {
		const filter: JSONSchema = {
			type: 'string',
			format: 'date-time',
			const: normalizedValue,
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

	if (operator === 'is_before') {
		const filter = {
			type: 'string',
			format: 'date-time',
			formatMaximum: normalizedValue,
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

	if (operator === 'is_after') {
		const filter = {
			type: 'string',
			format: 'date-time',
			formatMinimum: normalizedValue,
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

	return base;
};
