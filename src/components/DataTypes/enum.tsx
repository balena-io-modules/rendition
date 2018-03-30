import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import map = require('lodash/map');
import * as React from 'react';
import { DataTypeEditProps, SelectProps } from 'rendition';
import * as utils from '../../utils';
import Select from '../Select';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	is_not: {
		getLabel: (_s: JSONSchema6) => 'is not',
	},
};

type OperatorSlug = keyof typeof operators;

interface EnumFilter extends JSONSchema6 {
	title: OperatorSlug;
}

export const decodeFilter = (
	filter: EnumFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: string;
} | null => {
	const field = Object.keys(filter.properties!).shift()!;
	const operator: OperatorSlug = filter.title;
	let value: string;

	if (!filter.properties || !filter.properties![field]) {
		return null;
	}

	if (operator === 'is') {
		value = (filter.properties[field] as JSONSchema6).const! as any;
	} else if (operator === 'is_not') {
		value = ((filter.properties[field] as JSONSchema6).not! as JSONSchema6)
			.const as any;
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
): EnumFilter => {
	// Cast the operator type so that all DataType create filter functions can have the same call signature
	const operator: OperatorSlug = o as any;
	const { title } = schema;
	const base: EnumFilter = {
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
					const: value,
				},
			},
		});
	}

	if (operator === 'is_not') {
		return assign(base, {
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

export const Edit = ({
	schema,
	value,
	onUpdate,
	...props
}: DataTypeEditProps & SelectProps & { slim?: boolean }) => (
	<Select
		{...props}
		value={value}
		onChange={(e: Event) => onUpdate((e.target as HTMLSelectElement).value)}
	>
		{map(schema.enum, (item: string) => <option key={item}>{item}</option>)}
	</Select>
);
