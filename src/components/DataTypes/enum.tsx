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
	};
};

export const createFilter = (
	field: string,
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema6,
): EnumFilter => {
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
			required: [ field ],
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
		onChange={(e: React.FormEvent<HTMLSelectElement>) =>
			onUpdate(e.currentTarget.value)
		}
	>
		{map(schema.enum, (item: string) => <option key={item}>{item}</option>)}
	</Select>
);
