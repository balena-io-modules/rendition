import { JSONSchema6 } from 'json-schema';
import assign from 'lodash/assign';
import * as React from 'react';
import * as utils from '../../utils';
import { DataTypeEditProps } from '../Filters';
import Select, { SelectProps } from '../Select';
import { getJsonDescription } from './utils';

const getCaption = (value: any, schema: JSONSchema6) => {
	const item = schema.oneOf!.find(
		item => item && (item as JSONSchema6).const === value,
	);
	return item ? (item as JSONSchema6).title : '';
};

export const operators = {
	is: {
		getLabel: (_s: JSONSchema6) => 'is',
	},
	is_not: {
		getLabel: (_s: JSONSchema6) => 'is not',
	},
};

type OperatorSlug = keyof typeof operators;

interface OneOfFilter extends JSONSchema6 {
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

interface DecodeFilterResult {
	field: string;
	operator: OperatorSlug;
	value: any;
}

export const decodeFilter = (
	filter: OneOfFilter,
): DecodeFilterResult | null => {
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
): OneOfFilter => {
	const { title } = schema;
	const base: OneOfFilter = {
		$id: utils.randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			getCaption(value, schema) || '',
		),
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

interface OneOf {
	const: string | boolean | number;
	title: string;
}

export const Edit = ({
	schema,
	value,
	onUpdate,
	...props
}: DataTypeEditProps & SelectProps<OneOf>) => (
	<Select<OneOf>
		{...props}
		options={(schema.oneOf as OneOf[]) || []}
		valueKey="const"
		labelKey="title"
		value={(schema.oneOf || []).find((x: OneOf) => x.const === value) as OneOf}
		onChange={({ option }) => onUpdate(option.const.toString())}
	/>
);
