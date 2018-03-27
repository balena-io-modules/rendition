import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import * as React from 'react';
import { DataTypeEditProps, InputProps } from 'rendition';
import * as utils from '../../utils';
import Input from '../Input';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	is_more_than: {
		getLabel: (_s: JSONSchema6) => 'is more than',
	},
	is_less_than: {
		getLabel: (_s: JSONSchema6) => 'is less than',
	},
};

type OperatorSlug = keyof typeof operators;

export const decodeFilter = (
	filter: any,
): {
	field: string;
	operator: OperatorSlug;
	value: number;
} | null => {
	const field = Object.keys(filter.properties!).shift()!;
	const operator: OperatorSlug = filter.title;
	let value: number;

	if (!filter.properties || !filter.properties![field]) {
		return null;
	}

	if (operator === 'is') {
		value = (filter.properties[field] as JSONSchema6).const! as number;
	} else if (operator === 'is_more_than') {
		value = (filter.properties[field] as JSONSchema6).exclusiveMinimum!;
	} else if (operator === 'is_less_than') {
		value = (filter.properties[field] as JSONSchema6).exclusiveMaximum!;
	} else {
		return null;
	}

	return {
		field,
		operator,
		value,
	};
};

export const createFilter = (
	field: string,
	o: string,
	value: any,
	schema: JSONSchema6,
): JSONSchema6 => {
	// Cast the operator type so that all DataType create filter functions can have the same call signature
	const operator: OperatorSlug = o as any;
	const { title } = schema;
	const base: JSONSchema6 = {
		$id: utils.randomString(),
		title: operator,
		description: `${title || field} ${operators[operator].getLabel(
			schema,
		)} ${value}`,
		type: 'object',
	};

	if (operator === 'is') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'number',
					const: value,
				},
			},
		});
	}

	if (operator === 'is_more_than') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'number',
					exclusiveMinimum: value,
				},
			},
		});
	}

	if (operator === 'is_less_than') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'number',
					exclusiveMaximum: value,
				},
			},
		});
	}

	return base;
};

export const Edit = ({
	value,
	onUpdate,
	...props
}: DataTypeEditProps & InputProps & { slim?: boolean }) => (
	<Input
		{...props}
		type="number"
		value={value}
		onChange={(e: Event) =>
			onUpdate(parseFloat((e.target as HTMLInputElement).value))
		}
	/>
);
