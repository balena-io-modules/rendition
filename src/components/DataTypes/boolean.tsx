import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import * as React from 'react';
import { DataTypeEditProps, FilterSignature, SelectProps } from 'rendition';
import * as utils from '../../utils';
import Select from '../Select';

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
};

type OperatorSlug = keyof typeof operators;

export const decodeFilter = (filter: any): FilterSignature | null => {
	const field = Object.keys(filter.properties!).shift()!;
	const operator: OperatorSlug = filter.title;
	let value: boolean;

	if (!filter.properties || !filter.properties![field]) {
		return null;
	}

	if (operator === 'is') {
		value = (filter.properties[field] as JSONSchema6).const as boolean;
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
					const: value,
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
}: DataTypeEditProps & SelectProps & { slim?: boolean }) => (
	<Select
		{...props}
		value={value ? 'true' : 'false'}
		onChange={(e: Event) =>
			onUpdate((e.target as HTMLSelectElement).value === 'true')
		}
	>
		<option>true</option>
		<option>false</option>
	</Select>
);
