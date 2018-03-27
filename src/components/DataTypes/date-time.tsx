import { JSONSchema6 } from 'json-schema';
import assign = require('lodash/assign');
import * as React from 'react';
import { DataTypeEditProps, InputProps } from 'rendition';
import * as utils from '../../utils';
import Input from '../Input';

const getDefaultDate = (): string => {
	const now = new Date();
	const day = ('0' + now.getDate()).slice(-2);
	const month = ('0' + (now.getMonth() + 1)).slice(-2);
	const today = now.getFullYear() + '-' + month + '-' + day;

	return `${today}T00:00`;
};

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	is_before: {
		getLabel: (_s: JSONSchema6) => 'is before',
	},
	is_after: {
		getLabel: (_s: JSONSchema6) => 'is after',
	},
};

type OperatorSlug = keyof typeof operators;

export const decodeFilter = (
	filter: any,
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
		value = (filter.properties[field] as JSONSchema6).const! as string;
	} else if (operator === 'is_before') {
		value = (filter.properties[field] as JSONSchema6).formatMaximum!;
	} else if (operator === 'is_after') {
		value = (filter.properties[field] as JSONSchema6).formatMinimum!;
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
					type: 'string',
					format: 'date-time',
					const: value,
				},
			},
		});
	}

	if (operator === 'is_before') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					formatMaximum: value,
				},
			},
		});
	}

	if (operator === 'is_after') {
		return assign(base, {
			properties: {
				[field]: {
					type: 'string',
					format: 'date-time',
					formatMinimum: value,
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
}: DataTypeEditProps & InputProps & { slim?: boolean }) => {
	// If a value isn't provided here, set the value to today's date
	if (!value) {
		onUpdate(getDefaultDate());
	}
	return (
		<Input
			{...props}
			type="datetime-local"
			value={value}
			onChange={(e: Event) => onUpdate((e.target as HTMLInputElement).value)}
		/>
	);
};
