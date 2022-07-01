import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import {
	generateSchemaFromRefScheme,
	isJson,
} from '../../extra/AutoUI/models/helpers';
import { FilterSignature } from '.';
import { getDataModel } from '../DataTypes';
import { randomString } from '../../utils';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import { isKeyValueObj } from '../DataTypes/object';
import { getJsonDescription } from '../DataTypes/utils';
import { OperatorSlug as arrayOperatorSlug } from '../DataTypes/array';
import { OperatorSlug as booleanOperatorSlug } from '../DataTypes/boolean';
import { OperatorSlug as dateTimeOperatorSlug } from '../DataTypes/date-time';
import { OperatorSlug as enumOperatorSlug } from '../DataTypes/enum';
import { OperatorSlug as numberOperatorSlug } from '../DataTypes/number';
import { OperatorSlug as objectOperatorSlug } from '../DataTypes/object';
import { OperatorSlug as oneOfOperatorSlug } from '../DataTypes/oneOf';
import { OperatorSlug as stringOperatorSlug } from '../DataTypes/string';

const ajv = new Ajv();
ajvKeywords(ajv, ['regexp', 'formatMaximum', 'formatMinimum']);

export const FULL_TEXT_SLUG = 'full_text_search';
export interface Operator<T> {
	slug: T;
	label: string;
}

export type OperatorSlugs =
	| arrayOperatorSlug
	| booleanOperatorSlug
	| dateTimeOperatorSlug
	| enumOperatorSlug
	| numberOperatorSlug
	| objectOperatorSlug
	| oneOfOperatorSlug
	| stringOperatorSlug;

export type CreateFilter = (
	field: string,
	operator: Operator<OperatorSlugs>,
	value: any,
	subSchema: JSONSchema,
	refScheme?: string,
) => JSONSchema;

export type EditSchema = (
	schema: JSONSchema,
	operator: Operator<OperatorSlugs> | undefined,
) => JSONSchema;

interface FullTextFilterItem {
	key: string;
	schema: JSONSchema;
	operator: Operator<string>;
	model: {
		createFilter: CreateFilter;
	};
	searchKey?: string;
}

export type FilterSignatureWithKey = FilterSignature & { key: string };

export const getSignatures = (filter: JSONSchema): FilterSignatureWithKey[] => {
	const signatures = filter.anyOf!.map((f: JSONSchema) => {
		return parseFilterDescription(f);
	});

	return (signatures.filter((s) => s !== null) ?? []).map((s) => ({
		...s,
		key: !!s.refScheme ? `${s.field}__${s.refScheme}` : s.field,
	}));
};

export const createFilter = (
	schema: JSONSchema,
	signatures: FilterSignature[],
): JSONSchema => {
	const anyOf = signatures.map(({ field, operator, value, refScheme }) => {
		const subSchema = !!refScheme
			? generateSchemaFromRefScheme(schema, field, refScheme)
			: { ...(schema.properties![field] as JSONSchema) };
		const model = getDataModel(subSchema);
		if (!model) {
			return {};
		}
		return {
			$id: randomString(),
			title: operator.slug,
			description: getJsonDescription(
				subSchema.title,
				field,
				operator,
				value,
				refScheme,
			),
			type: 'object',
			...(model.createFilter as CreateFilter)(
				field,
				operator,
				value,
				subSchema,
				refScheme,
			),
		};
	});
	return {
		$id: randomString(),
		anyOf,
	};
};

export const createFullTextSearchFilter = (
	schema: JSONSchema,
	term: string,
) => {
	const items = !!schema.properties
		? Object.entries(schema.properties as JSONSchema).reduce(
				(itemsAccumulator, entry) => {
					const [key, item] = entry;
					const model = getDataModel(item);
					if (item.type?.includes('boolean') || !model) {
						return itemsAccumulator;
					}
					const defaultItem = {
						key,
						schema: item,
						model,
					};
					const operators = model.operators(item);
					if (
						!item.type ||
						!(item.type.includes('object') && isKeyValueObj(item))
					) {
						itemsAccumulator.push({
							...defaultItem,
							operator:
								'contains' in operators
									? { label: 'contains', slug: 'contains' }
									: { label: 'is', slug: 'is' },
						});
					} else if (item.type?.includes('object') && isKeyValueObj(item)) {
						itemsAccumulator.push({
							...defaultItem,
							operator: {
								label: operators['key_contains' as keyof typeof operators],
								slug: 'key_contains',
							},
							searchKey: findKey(item.properties!, { description: 'key' })!,
						});
						itemsAccumulator.push({
							...defaultItem,
							operator: {
								label: operators['value_contains' as keyof typeof operators],
								slug: 'value_contains',
							},
							searchKey: findKey(item.properties!, { description: 'value' })!,
						});
					}
					return itemsAccumulator;
				},
				[] as FullTextFilterItem[],
		  )
		: [];
	const filter = generateFullTextSearchAjvFilter(term, items);
	return filter;
};

// A schema that matches applies the pattern to each schema field
const generateFullTextSearchAjvFilter = (
	term: string,
	items: FullTextFilterItem[],
): JSONSchema => {
	return {
		$id: randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				title: FULL_TEXT_SLUG,
				description: getJsonDescription(
					'Any field',
					'any',
					{ slug: FULL_TEXT_SLUG, label: 'contains' },
					term,
					undefined,
				),
				anyOf: items
					.map(({ key, schema, operator, model, searchKey }) => {
						const val = !!searchKey ? { [searchKey]: term } : term;
						return model.createFilter(
							key,
							operator as Operator<OperatorSlugs>,
							val,
							schema,
						);
					})
					.filter((item) => Object.keys(item).length > 0),
			},
		],
	};
};

export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: T[],
): T[];
export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: Record<string, T>,
): Record<string, T>;
export function filter<T>(
	filters: JSONSchema | JSONSchema[],
	collection: T[] | Record<string, T>,
) {
	// Remove all schemas that may have been compiled already
	ajv.removeSchema(/^.*$/);

	const validators = Array.isArray(filters)
		? filters.map((s) => ajv.compile(s))
		: [ajv.compile(filters)];
	if (Array.isArray(collection)) {
		return collection.filter((m) => validators.every((v) => v(m)));
	}

	return pickBy(collection, (m) => validators.every((v) => v(m)));
}

export const parseFilterDescription = (filter: JSONSchema): FilterSignature => {
	return filter.description && isJson(filter.description)
		? JSON.parse(filter.description)
		: null;
};

export const getOperators = (
	schema: JSONSchema,
	field: string,
): Array<Operator<OperatorSlugs>> => {
	const subSchema = schema.properties![field] as JSONSchema;
	const model = getDataModel(subSchema);

	if (!model) {
		return [];
	}

	return Object.entries(model.operators(subSchema)).map(
		([key, value]: [OperatorSlugs, string]) => ({
			slug: key,
			label: value,
		}),
	);
};

export const getModelFilter = (
	schema: JSONSchema,
	field: string,
	operator: Operator<OperatorSlugs>,
	value: any,
	isFullTextSearch?: boolean,
	operatorConverter?: (
		operator: Operator<OperatorSlugs>,
		operators: any,
	) => Operator<OperatorSlugs>,
): JSONSchema => {
	let newOperator = operator;
	let subSchema = schema;
	if (isFullTextSearch) {
		subSchema = { ...schema };
		delete subSchema.oneOf;
		delete subSchema.enum;
	}
	const model = getDataModel(subSchema);
	if (!model) {
		throw new Error(
			`getModelFilter: model not defied, something is probably wrong with the type declaration in the schema! field: ${field}, type: ${subSchema.type}`,
		);
	}
	if (operatorConverter) {
		const operators = model.operators(schema);
		newOperator = operatorConverter(operator, operators);
	}
	const filter = (model.createFilter as CreateFilter)(
		field,
		newOperator,
		value,
		subSchema,
	);
	return filter;
};
