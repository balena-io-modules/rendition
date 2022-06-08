import isEmpty from 'lodash/isEmpty';
import {
	AutoUIModel,
	autoUIJsonSchemaPick,
	AutoUIRawModel,
} from '../schemaOps';
import {
	JSONSchema7 as JSONSchema,
	JSONSchema7Definition as JSONSchemaDefinition,
} from 'json-schema';
import { Dictionary } from '../../../common-types';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { findInObject } from '../utils';

type Transformers<
	T extends Dictionary<any>,
	TTransformer extends Dictionary<any>,
	TContext extends any,
> = {
	[field in keyof TTransformer]: (
		entry: T,
		context?: TContext,
	) => TTransformer[field];
};

export const autoUIDefaultPermissions = {
	read: [],
	create: [],
	update: [],
	delete: false,
};

export const isJson = (str: string) => {
	try {
		JSON.parse(str);
	} catch (err) {
		return false;
	}
	return true;
};

export const autoUIRunTransformers = <
	T extends Dictionary<any>,
	TResult extends T,
	TContext extends any,
>(
	data: T | undefined,
	transformers: Transformers<T, Omit<TResult, keyof T>, TContext>,
	context?: TContext,
): TResult | undefined => {
	if (!data) {
		return data;
	}

	if (!transformers || isEmpty(transformers)) {
		return data as TResult;
	}

	const transformEntry = (entry: TResult) =>
		Object.entries(transformers).forEach(
			([fieldName, transformer]: [keyof TResult, any]) => {
				entry[fieldName] = transformer(entry, context);
			},
		);

	// We mutate the data for performance reasons, it shouldn't matter as it is just a middleware.
	const mutatedData = data as TResult;
	if (Array.isArray(mutatedData)) {
		mutatedData.forEach(transformEntry);
	} else {
		transformEntry(mutatedData);
	}
	return mutatedData;
};

export const autoUIAdaptRefScheme = (
	field: unknown,
	property: JSONSchemaDefinition,
) => {
	if (!property || field == null) {
		return null;
	}
	if (typeof property === 'boolean') {
		return field;
	}
	const format = getSchemaFormat(property);
	if (
		!property.description?.includes('x-ref-scheme') ||
		!isJson(property.description) ||
		!!format
	) {
		return field;
	}
	const refScheme = getPropertyRefScheme(property);
	const transformed =
		(Array.isArray(field) && field.length <= 1 ? field[0] : field) ?? null;
	if (refScheme) {
		return get(transformed, refScheme[0]) ?? null;
	}
	return transformed;
};

// This transformation would happen elsewhere, and it wouldn't be part of AutoUI
export const autoUIGetModelForCollection = <T>(
	model: AutoUIRawModel<T>,
	context?: { accessRole?: string | null },
): AutoUIModel<T> => {
	const accessRole = context?.accessRole;
	const schema = !!model.priorities
		? autoUIJsonSchemaPick(model.schema, [
				...model.priorities.primary,
				...model.priorities.secondary,
				...model.priorities.tertiary,
		  ])
		: model.schema;
	return {
		...model,
		permissions:
			(accessRole != null && model.permissions[accessRole]) ||
			model.permissions['default'],
		schema,
	};
};

export const autoUIAddToSchema = (
	schema: JSONSchema,
	schemaProperty: string,
	property: string,
	value: any,
) => {
	return {
		...schema,
		properties: {
			...schema.properties,
			[schemaProperty]: {
				...(schema.properties?.[schemaProperty] as JSONSchema),
				[property]: value,
			},
		},
	};
};

export const getPropertyRefScheme = (
	schemaValue: JSONSchema | JSONSchemaDefinition | undefined,
): string[] | null => {
	return !!schemaValue &&
		typeof schemaValue !== 'boolean' &&
		!!schemaValue.description &&
		isJson(schemaValue.description)
		? JSON.parse(schemaValue.description!)['x-ref-scheme'] ||
				JSON.parse(schemaValue.description!)['refScheme']
		: null;
};

export const convertRefSchemeToSchemaPath = (refScheme: string | undefined) => {
	return !!refScheme
		? refScheme
				.split('.')
				.join('.properties.')
				.replace(/\[[a-zA-Z0-9-_]*\]/g, '.items')
		: refScheme;
};

export const getSchemaFormat = (schema: JSONSchema) => {
	const property = getSubSchemaFromRefScheme(schema);
	const format = property.format ?? schema.format;
	return format;
};

export const getRefSchemeTitle = (
	refScheme: string | undefined,
	jsonSchema: JSONSchema,
	propertyKey: string,
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
	parentProperty: string,
	schema: JSONSchema,
	refScheme: string | undefined,
) => {
	const propertySchema = schema.properties?.[parentProperty] as JSONSchema;
	if (!refScheme) {
		return propertySchema;
	}
	const convertedRefScheme = propertySchema.items
		? `items.properties.${convertRefSchemeToSchemaPath(refScheme)}`
		: `properties.${convertRefSchemeToSchemaPath(refScheme)}`;
	const typePaths: string[][] = [];
	const propertyPath: string[] = [];
	convertedRefScheme.split('.').forEach((key, i) => {
		if (i % 2 === 1 && ['properties', 'items'].includes(key)) {
			typePaths.push([...propertyPath, 'type']);
		}
		propertyPath.push(key);
	});
	if (propertyPath) {
		typePaths.push(propertyPath);
	}
	return {
		...propertySchema,
		description: JSON.stringify({ 'x-ref-scheme': [refScheme] }),
		title:
			(get(propertySchema, convertedRefScheme) as JSONSchema)?.title ??
			propertySchema.title,
		...pick(
			propertySchema,
			typePaths.map((t) => t.join('.')),
		),
	};
};

export const getSubSchemaFromRefScheme = (
	schema: JSONSchema | JSONSchemaDefinition,
	refScheme?: string,
): JSONSchema => {
	const referenceScheme = refScheme || getPropertyRefScheme(schema)?.[0];
	const convertedRefScheme = convertRefSchemeToSchemaPath(referenceScheme);
	if (!convertedRefScheme) {
		return schema as JSONSchema;
	}
	const properties = findInObject(schema, 'properties');
	return get(properties, convertedRefScheme);
};

export const adaptOperatorForParentModel = (operator: string) =>
	operator.includes('not') ? 'not_contains' : 'contains';
