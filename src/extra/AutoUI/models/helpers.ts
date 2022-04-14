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

	if (
		typeof property === 'boolean' ||
		!property.description?.includes('x-ref-scheme') ||
		!isJson(property.description)
	) {
		return field;
	}

	const descriptionObject = JSON.parse(property.description!);
	const refScheme = descriptionObject['x-ref-scheme'];
	const transformed =
		(Array.isArray(field) && field.length <= 1 ? field[0] : field) ?? null;
	if (refScheme) {
		return get(transformed, refScheme) ?? null;
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
