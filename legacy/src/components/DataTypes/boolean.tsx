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

interface BooleanFilter extends JSONSchema6 {
	title: OperatorSlug;
	properties?: {
		[k: string]: { const: boolean };
	};
}

export const decodeFilter = (filter: BooleanFilter): FilterSignature | null => {
	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
	if (!keys.length) {
		return null;
	}

	const field = keys[0];
	const operator = filter.title;
	let value: boolean;

	if (operator === 'is') {
		value = filter.properties[field].const;
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
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema6,
): BooleanFilter => {
	const { title } = schema;
	const base: BooleanFilter = {
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
			required: [field],
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
		onChange={(e: React.FormEvent<HTMLSelectElement>) =>
			onUpdate(e.currentTarget.value === 'true')
		}
	>
		<option>true</option>
		<option>false</option>
	</Select>
);
