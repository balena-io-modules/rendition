import { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import {
	getPropertyRefScheme,
	getSubSchemaFromRefScheme,
} from '../../extra/AutoUI/models/helpers';
import { randomString } from '../../utils';
import { DataTypeEditProps, FilterSignature } from '../Filters';
import { Select, SelectProps } from '../Select';
import { getJsonDescription } from './utils';

const getCaption = (value: any, schema: JSONSchema) => {
	const item = schema.oneOf!.find(
		(item) => item && (item as JSONSchema).const === value,
	) as JSONSchema;
	return item && item.title ? item.title : value ?? '';
};

export const operators = {
	is: {
		getLabel: (_s: JSONSchema) => 'is',
	},
	is_not: {
		getLabel: (_s: JSONSchema) => 'is not',
	},
};

type OperatorSlug = keyof typeof operators;

interface OneOfFilter extends JSONSchema {
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

export const decodeFilter = (filter: OneOfFilter): FilterSignature | null => {
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
	const refScheme = getPropertyRefScheme(filter)?.[0];

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
): OneOfFilter | JSONSchema => {
	const { title } = schema;
	const subSchema = getSubSchemaFromRefScheme(schema);
	const base: OneOfFilter = {
		$id: randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			getCaption(value, subSchema) || '',
			refScheme,
		),
		type: 'object',
	};

	if (operator === 'is') {
		const filter = {
			const: value,
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

	if (operator === 'is_not') {
		const filter = {
			not: {
				const: value,
			},
		};
		return recursive
			? filter
			: Object.assign(base, {
					properties: {
						[field]: filter,
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
}: DataTypeEditProps & SelectProps<OneOf>) => {
	const subSchema = getSubSchemaFromRefScheme(schema);
	return (
		<Select<OneOf>
			{...props}
			options={(subSchema.oneOf as OneOf[]) || []}
			valueKey="const"
			labelKey="title"
			value={
				(subSchema.oneOf || []).find((x: OneOf) => x.const === value) as OneOf
			}
			onChange={({ option }) => onUpdate(option.const.toString())}
		/>
	);
};
