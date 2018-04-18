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

interface NumberFilter extends JSONSchema6 {
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

export const decodeFilter = (
	filter: NumberFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: number;
} | null => {
	const operator = filter.title;

	if (!filter.properties) {
		return null;
	}

	const keys = Object.keys(filter.properties);
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
	};
};

export const createFilter = (
	field: string,
	operator: OperatorSlug,
	value: any,
	schema: JSONSchema6,
): NumberFilter => {
	const { title } = schema;
	const base: NumberFilter = {
		$id: utils.randomString(),
		title: operator,
		description: `${title || field} ${operators[operator].getLabel(
			schema,
		)} ${value}`,
		type: 'object',
		required: [field],
	};

	if (operator === 'is') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'number',
					const: value,
				},
			},
			required: [ field ],
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
			required: [ field ],
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
		onChange={(e: React.FormEvent<HTMLInputElement>) =>
			onUpdate(parseFloat(e.currentTarget.value))
		}
	/>
);
