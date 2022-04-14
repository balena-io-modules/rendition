import { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import { randomString, regexEscape } from '../../utils';
import { DataTypeEditProps } from '../Filters';
import { Input, InputProps } from '../Input';
import { Textarea, TextareaProps } from '../Textarea';
import { getJsonDescription } from './utils';
import { Select, SelectProps } from '../Select';
import { findInObject } from '../../extra/AutoUI/utils';

export const operators = {
	contains: {
		getLabel: (_s: JSONSchema) => 'contains',
	},
	not_contains: {
		getLabel: (_s: JSONSchema) => 'does not contain',
	},
};

type OperatorSlug = keyof typeof operators;

interface StringFilter extends JSONSchema {
	title: OperatorSlug;
	properties?: {
		[k: string]: {
			not?: {
				contains: {
					const: string;
				};
			};
			contains?: {
				const: string;
			};
		};
	};
	anyOf?: Array<{
		properties?: {
			[k: string]: {
				not?: {
					contains: {
						const: string;
					};
				};
				contains?: {
					const: string;
				};
			};
		};
	}>;
}

export const decodeFilter = (
	filter: StringFilter,
): {
	field: string;
	operator: OperatorSlug;
	value: string;
} | null => {
	const operator = filter.title;
	const properties = findInObject(filter, 'properties');
	const [firstPropKey] = Object.keys(properties);
	const field = firstPropKey;
	const value =
		findInObject(filter, 'const') ?? findInObject(filter, 'pattern');

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
	schema: JSONSchema,
): JSONSchema => {
	const { title } = schema;
	const base: StringFilter = {
		$id: randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			value,
		),
		type: 'object',
	};

	const filter = getFilter(schema, value);

	if (operator === 'contains') {
		return Object.assign(base, {
			properties: {
				[field]: {
					type: 'array',
					...filter,
				},
			},
			required: [field],
		});
	}

	if (operator === 'not_contains') {
		return Object.assign(base, {
			anyOf: [
				{
					properties: {
						[field]: {
							type: 'array',
							not: {
								...filter,
							},
						},
					},
				},
				{
					properties: {
						[field]: {
							type: 'null',
						},
					},
				},
			],
		});
	}

	return base;
};

interface OneOf {
	const: string | boolean | number;
	title: string;
}

export const Edit = ({
	onUpdate,
	slim,
	...props
}: DataTypeEditProps &
	TextareaProps &
	InputProps &
	Omit<SelectProps<OneOf>, 'onChange'> & { slim?: boolean }) => {
	const schemaItems = props.schema.items as JSONSchema | undefined;
	if (schemaItems?.oneOf) {
		return (
			<Select<OneOf>
				{...props}
				options={schemaItems.oneOf || []}
				valueKey="const"
				labelKey="title"
				value={
					(schemaItems.oneOf || []).find(
						(x: OneOf) => x.const === props.value,
					) as OneOf
				}
				onChange={({ option }) => onUpdate(option.const.toString())}
			/>
		);
	}
	if (slim) {
		return (
			<Input
				onChange={(e: React.FormEvent<HTMLInputElement>) =>
					onUpdate(e.currentTarget.value)
				}
				{...props}
			/>
		);
	}

	return (
		<Textarea
			onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
				onUpdate(e.currentTarget.value)
			}
			{...props}
		/>
	);
};

export const getFilter = (schema: JSONSchema, value: string) => {
	if (
		!!schema?.items &&
		typeof schema.items !== 'boolean' &&
		'properties' in schema.items &&
		!!schema.items.properties
	) {
		return {
			minItems: 1,
			items: {
				properties: Object.keys(schema.items.properties).reduce(
					(props: NonNullable<JSONSchema['properties']>, propKey: string) => {
						props[propKey] = {
							pattern: regexEscape(value),
							// @ts-expect-error ajv knows this rule
							flags: 'i',
						};
						return props;
					},
					{},
				),
			},
		};
	}
	return { contains: { const: value } };
};
