import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import find = require('lodash/find');
import findKey = require('lodash/findKey');
import includes = require('lodash/includes');
import isString = require('lodash/isString');
import mapValues = require('lodash/mapValues');
import * as React from 'react';
import { DataTypeEditProps } from 'rendition';
import * as utils from '../../utils';
import { Flex } from '../Grid';
import Input from '../Input';

const getKeyLabel = (schema: JSONSchema6) => {
	const s = find(schema.properties!, { description: 'key' })! as JSONSchema6;
	return s && s.title ? s.title : 'key';
};

const getValueLabel = (schema: JSONSchema6) => {
	const s = find(schema.properties!, { description: 'value' })! as JSONSchema6;
	return s && s.title ? s.title : 'value';
};

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	is_not: {
		getLabel: (_s: JSONSchema6) => 'is not',
	},
	key_is: {
		getLabel: (s: JSONSchema6) => `${getKeyLabel(s)} is`,
	},
	key_contains: {
		getLabel: (s: JSONSchema6) => `${getKeyLabel(s)} contains`,
	},
	key_not_contains: {
		getLabel: (s: JSONSchema6) => `${getKeyLabel(s)} does not contain`,
	},
	key_matches_re: {
		getLabel: (s: JSONSchema6) => `${getKeyLabel(s)} matches RegEx`,
	},
	key_not_matches_re: {
		getLabel: (s: JSONSchema6) => `${getKeyLabel(s)} does not match RegEx`,
	},
	value_is: {
		getLabel: (s: JSONSchema6) => `${getValueLabel(s)} is`,
	},
	value_contains: {
		getLabel: (s: JSONSchema6) => `${getValueLabel(s)} contains`,
	},
	value_not_contains: {
		getLabel: (s: JSONSchema6) => `${getValueLabel(s)} does not contain`,
	},
	value_matches_re: {
		getLabel: (s: JSONSchema6) => `${getValueLabel(s)} matches RegEx`,
	},
	value_not_matches_re: {
		getLabel: (s: JSONSchema6) => `${getValueLabel(s)} does not match RegEx`,
	},
};

type OperatorSlug = keyof typeof operators;

const keyOperators: OperatorSlug[] = [
	'is',
	'is_not',
	'key_is',
	'key_contains',
	'key_not_contains',
	'key_matches_re',
	'key_not_matches_re',
];

const valueOperators: OperatorSlug[] = [
	'is',
	'is_not',
	'value_is',
	'value_contains',
	'value_not_contains',
	'value_matches_re',
	'value_not_matches_re',
];

interface SubSchema {
	title: string;
	properties: {
		[key: string]: {
			const?: string;
			description?: string;
			pattern?: string;
		};
	};
}

interface ObjectFilter extends JSONSchema6 {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			contains?: SubSchema;
			not?: {
				contains: SubSchema;
			};
		};
	};
}

export const decodeFilter = (
	filter: ObjectFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: {};
} | null => {
	const operator = filter.title;

	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	if (!keys.length) {
		return null;
	}
	let value: { [key: string]: string };

	const field = keys[0];

	if (operator === 'is') {
		value = mapValues(
			filter.properties[field].contains!.properties,
			v => v.const!,
		);
	} else if (operator === 'is_not') {
		value = mapValues(
			filter.properties[field].not!.contains.properties,
			v => v.const!,
		);
	} else if (operator === 'key_is' || operator === 'value_is') {
		value = mapValues(
			filter.properties[field].contains!.properties,
			v => v.const!,
		);
	} else if (operator === 'key_contains' || operator === 'value_contains') {
		value = mapValues(
			filter.properties[field].contains!.properties,
			v => v.description!,
		);
	} else if (
		operator === 'key_not_contains' ||
		operator === 'value_not_contains'
	) {
		value = mapValues(
			filter.properties[field].not!.contains.properties,
			v => v.description!,
		);
	} else if (operator === 'key_matches_re' || operator === 'value_matches_re') {
		value = mapValues(
			filter.properties[field].contains!.properties,
			v => v.pattern!,
		);
	} else if (
		operator === 'key_not_matches_re' ||
		operator === 'value_not_matches_re'
	) {
		value = mapValues(
			filter.properties[field].not!.contains.properties,
			v => v.pattern!,
		);
	} else {
		return null;
	}

	return {
		field,
		operator,
		value,
	};
};

const format = (schema: JSONSchema6, object: { [k: string]: string }) => {
	const keyField = findKey(schema.properties!, { description: 'key' })!;
	const valueField = findKey(schema.properties!, { description: 'value' })!;
	const key = object[keyField];
	const value = object[valueField];
	return key && value ? `${key} : ${value}` : key || value;
};

export const createFilter = (
	field: string,
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema6,
): JSONSchema6 => {
	const { title } = schema;
	const base: ObjectFilter = {
		title: operator,
		description: `${title || field} ${operators[operator].getLabel(
			schema,
		)} ${format(schema, value)}`,
		type: 'object',
	};

	if (operator === 'is') {
		return assign(base, {
			properties: {
				[field]: {
					contains: {
						title,
						properties: mapValues(value, v => ({ const: v })),
					},
				},
			},
			required: [field],
		});
	}

	if (operator === 'is_not') {
		return assign(base, {
			properties: {
				[field]: {
					not: {
						contains: {
							title,
							properties: mapValues(value, v => ({ const: v })),
						},
					},
				},
			},
		});
	}

	if (operator === 'key_is' || operator === 'value_is') {
		return assign(base, {
			properties: {
				[field]: {
					contains: {
						title,
						properties: mapValues(value, v => ({ const: v })),
					},
				},
			},
			required: [field],
		});
	}

	if (operator === 'key_contains' || operator === 'value_contains') {
		return assign(base, {
			properties: {
				[field]: {
					contains: {
						title,
						properties: mapValues(value, v => ({
							type: 'string',
							description: v,
							pattern: utils.regexEscape(v),
						})),
					},
				},
			},
			required: [field],
		});
	}

	if (operator === 'key_not_contains' || operator === 'value_not_contains') {
		return assign(base, {
			properties: {
				[field]: {
					not: {
						contains: {
							title,
							properties: mapValues(value, v => ({
								type: 'string',
								description: v,
								pattern: utils.regexEscape(v),
							})),
						},
					},
				},
			},
		});
	}

	if (operator === 'key_matches_re' || operator === 'value_matches_re') {
		return assign(base, {
			properties: {
				[field]: {
					contains: {
						title,
						properties: mapValues(value, v => ({
							type: 'string',
							pattern: v,
						})),
					},
				},
			},
			required: [field],
		});
	}

	if (
		operator === 'key_not_matches_re' ||
		operator === 'value_not_matches_re'
	) {
		return assign(base, {
			properties: {
				[field]: {
					not: {
						contains: {
							title,
							properties: mapValues(value, v => ({
								type: 'string',
								pattern: v,
							})),
						},
					},
				},
			},
		});
	}

	return base;
};

export const Edit = (props: DataTypeEditProps) => {
	const { schema, onUpdate, operator } = props;
	let { value } = props;

	const schemaKey = findKey(schema.properties!, { description: 'key' })!;
	const schemaValue = findKey(schema.properties!, { description: 'value' })!;
	const keyLabel =
		(schema.properties![schemaKey] as JSONSchema6).title || 'Key';
	const valueLabel =
		(schema.properties![schemaValue] as JSONSchema6).title || 'Value';

	// Convert strings to objects
	if (isString(value)) {
		const p: { [k: string]: string } = {};
		if (includes(valueOperators, operator)) {
			p[schemaValue] = value;
		}
		if (includes(keyOperators, operator)) {
			p[schemaKey] = value;
		}

		value = p;
	}

	return (
		<Flex wrap>
			{includes(keyOperators, operator) && (
				<Input
					type="text"
					value={value ? value[schemaKey] : ''}
					mr={2}
					mb={1}
					placeholder={keyLabel}
					onChange={(e: React.FormEvent<HTMLInputElement>) =>
						onUpdate(
							assign(value, {
								[schemaKey]: e.currentTarget.value,
							}),
						)
					}
				/>
			)}
			{includes(valueOperators, operator) && (
				<Input
					type="text"
					value={value ? value[schemaValue] : ''}
					placeholder={valueLabel}
					onChange={(e: React.FormEvent<HTMLInputElement>) =>
						onUpdate(
							assign(value, {
								[schemaValue]: e.currentTarget.value,
							}),
						)
					}
				/>
			)}
		</Flex>
	);
};
