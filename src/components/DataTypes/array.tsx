import { JSONSchema7 as JSONSchema } from 'json-schema';
import * as React from 'react';
import { randomString } from '../../utils';
import { DataTypeEditProps, FilterSignature } from '../Filters';
import { Input, InputProps } from '../Input';
import { Textarea, TextareaProps } from '../Textarea';
import { getJsonDescription } from './utils';
import { Select, SelectProps } from '../Select';
import { findInObject } from '../../extra/AutoUI/utils';
import { getDataModel } from '.';
import {
	getPropertyRefScheme,
	getSubSchemaFromRefScheme,
} from '../../extra/AutoUI/models/helpers';

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

export const decodeFilter = (filter: StringFilter): FilterSignature | null => {
	const refScheme = getPropertyRefScheme(filter)?.[0];
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
): JSONSchema => {
	const { title } = schema;
	const base: StringFilter = {
		$id: randomString(),
		title: operator,
		description: getJsonDescription(
			title || field,
			operators[operator].getLabel(schema),
			value,
			refScheme,
		),
		type: 'object',
	};

	const filter = getFilter(schema, value);

	if (operator === 'contains') {
		const common = {
			type: 'array',
			...filter,
		} as JSONSchema;
		return recursive
			? common
			: Object.assign(base, {
					properties: {
						[field]: common,
					},
					required: [field],
			  });
	}

	if (operator === 'not_contains') {
		const common = [
			{
				type: 'array',
				not: {
					...filter,
				},
			},
			{
				type: 'null',
			},
		] as JSONSchema[];
		if (recursive) {
			return {
				anyOf: common,
			};
		}
		return Object.assign(base, {
			anyOf: [
				{
					properties: {
						[field]: common[0],
					},
				},
				{
					properties: {
						[field]: common[1],
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

type SelectType = OneOf | string;

export const Edit = ({
	onUpdate,
	slim,
	...props
}: DataTypeEditProps &
	TextareaProps &
	InputProps &
	Omit<SelectProps<OneOf>, 'onChange'> & { slim?: boolean }) => {
	const subSchema = getSubSchemaFromRefScheme(props.schema);
	const schemaItems = props.schema.items as JSONSchema | undefined;
	const oneOf = subSchema?.oneOf ?? schemaItems?.oneOf;
	const enumerator = (subSchema?.enum ?? schemaItems?.enum) as string[];
	if (oneOf || enumerator) {
		return (
			<Select<SelectType>
				{...props}
				options={oneOf || enumerator || []}
				{...(!!oneOf
					? {
							valueKey: 'const',
							labelKey: 'title',
					  }
					: undefined)}
				value={
					(oneOf
						? oneOf.find((x: OneOf) => x.const === props.value)
						: (enumerator || []).find((x) => x === props.value)) as SelectType
				}
				onChange={({ option }) =>
					onUpdate(
						typeof option === 'string' ? option : option.const.toString(),
					)
				}
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
				anyOf: [
					...Object.entries(schema.items.properties).reduce(
						(
							props: Array<JSONSchema['properties']>,
							[propKey, propValue]: [string, JSONSchema],
						) => {
							const model = getDataModel(propValue);
							const operator: string =
								model?.operators && 'contains' in model.operators
									? 'contains'
									: 'is';
							const filter = model?.createFilter(
								propKey,
								operator as never,
								value,
								propValue,
								true,
							);
							props.push({ properties: { [propKey]: filter } });
							return props;
						},
						[],
					),
				],
			},
		};
	}
	return {
		contains: {
			const: Number.isNaN(parseInt(value, 10)) ? value : Number(value),
		},
	};
};
