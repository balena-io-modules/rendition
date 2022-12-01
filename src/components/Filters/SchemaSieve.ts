import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import type {
	JSONSchema7 as JSONSchema,
	JSONSchema7Definition as JSONSchemaDefinition,
} from 'json-schema';
import { FilterSignature } from '.';
import { getDataModel, isDateTimeFormat, OperatorSlugs } from '../DataTypes';
import { findInObject, isJson, randomString } from '../../utils';
import pickBy from 'lodash/pickBy';
import { getJsonDescription } from '../DataTypes/utils';
import pick from 'lodash/pick';
import get from 'lodash/get';

const ajv = new Ajv();
ajvKeywords(ajv, ['regexp', 'formatMaximum', 'formatMinimum']);

export const FULL_TEXT_SLUG = 'full_text_search';
export interface Operator<T> {
	slug: T;
	label: string;
}

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
	model: ReturnType<typeof getDataModel>;
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
					if (
						item.type?.includes('boolean') ||
						isDateTimeFormat(item.format) ||
						!model
					) {
						return itemsAccumulator;
					}
					itemsAccumulator.push({
						key,
						schema: item,
						model,
					});
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
	const operator = {
		label: 'full text search',
		slug: FULL_TEXT_SLUG,
	} as const;
	return {
		$id: randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				title: FULL_TEXT_SLUG,
				description: getJsonDescription(
					'Any field',
					'any',
					operator,
					term,
					undefined,
				),
				anyOf: items
					.map(({ key, schema, model }) => {
						if (!model) {
							return {};
						}
						return model.createFilter(
							key,
							// @ts-expect-error we should check whether the operator is supported
							// rather than calling anyway and then checking for empty filter result.
							operator,
							term,
							schema,
						);
					})
					// Model types that do not support the operator, return an empty filter, which we drop.
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
	refScheme?: string,
): Array<Operator<OperatorSlugs>> => {
	const subSchema = (
		refScheme
			? getSubSchemaFromRefScheme(schema.properties![field], refScheme)
			: schema.properties![field]
	) as JSONSchema;
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
): JSONSchema => {
	const model = getDataModel(schema);
	if (!model) {
		throw new Error(
			`getModelFilter: model not defied, something is probably wrong with the type declaration in the schema! field: ${field}, type: ${schema.type}`,
		);
	}
	const filter = (model.createFilter as CreateFilter)(
		field,
		operator,
		value,
		schema,
	);
	return filter;
};

export const getSchemaFormat = (schema: JSONSchema) => {
	const property = getSubSchemaFromRefScheme(schema);
	const format = property.format ?? schema.format;
	return format;
};

export const getPropertyScheme = (
	schemaValue: JSONSchema | JSONSchemaDefinition,
) => {
	if (typeof schemaValue === 'boolean' || !schemaValue.description) {
		return null;
	}
	try {
		const json = JSON.parse(schemaValue.description!);
		return json['x-foreign-key-scheme'] ?? json['x-ref-scheme'];
	} catch (err) {
		return null;
	}
};

export const convertRefSchemeToSchemaPath = (refScheme: string | undefined) => {
	return !!refScheme
		? refScheme
				.split('.')
				.join('.properties.')
				.replace(/\[\d+\]/g, '.items')
		: // TODO: This atm doesn't support ['my property']
		  refScheme;
};

export const getSchemaTitle = (
	jsonSchema: JSONSchema,
	propertyKey: string,
	refScheme?: string | undefined,
) => {
	if (!refScheme) {
		return jsonSchema?.title || propertyKey;
	}
	return (
		getSubSchemaFromRefScheme(jsonSchema, refScheme)?.title ??
		jsonSchema.title ??
		propertyKey
	);
};

export const generateSchemaFromRefScheme = (
	schema: JSONSchema,
	parentProperty: string,
	refScheme: string | undefined,
): JSONSchema => {
	const propertySchema =
		(schema.properties?.[parentProperty] as JSONSchema) ?? schema;
	if (!refScheme) {
		return propertySchema;
	}
	const convertedRefScheme = propertySchema.items
		? `items.properties.${convertRefSchemeToSchemaPath(refScheme)}`
		: `properties.${convertRefSchemeToSchemaPath(refScheme)}`;
	const typePaths: string[][] = [];
	const ongoingIncrementalPath: string[] = [];
	convertedRefScheme.split('.').forEach((key) => {
		if (['properties', 'items'].includes(key)) {
			typePaths.push([...ongoingIncrementalPath, 'type']);
		}
		ongoingIncrementalPath.push(key);
	});
	if (ongoingIncrementalPath.length) {
		typePaths.push(ongoingIncrementalPath);
	}
	return {
		...propertySchema,
		description: JSON.stringify({ 'x-ref-scheme': [refScheme] }),
		title:
			(get(propertySchema, convertedRefScheme) as JSONSchema)?.title ??
			propertySchema.title,
		...pick(propertySchema, typePaths),
	};
};

export const getSubSchemaFromRefScheme = (
	schema: JSONSchema | JSONSchemaDefinition,
	refScheme?: string,
): JSONSchema => {
	const referenceScheme = refScheme || getPropertyScheme(schema)?.[0];
	const convertedRefScheme = convertRefSchemeToSchemaPath(referenceScheme);
	if (!convertedRefScheme) {
		return schema as JSONSchema;
	}
	const properties = findInObject(schema, 'properties');
	return get(properties, convertedRefScheme);
};
