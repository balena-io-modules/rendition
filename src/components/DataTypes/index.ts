import type { JSONSchema7 as JSONSchema } from 'json-schema';
import * as arrayType from './array';
import * as booleanType from './boolean';
import * as dateTimeType from './date-time';
import * as enumType from './enum';
import * as numberType from './number';
import * as objectType from './object';
import * as oneOfType from './oneOf';
import * as stringType from './string';

export type OperatorSlugs =
	| arrayType.OperatorSlug
	| booleanType.OperatorSlug
	| dateTimeType.OperatorSlug
	| enumType.OperatorSlug
	| numberType.OperatorSlug
	| objectType.OperatorSlug
	| oneOfType.OperatorSlug
	| stringType.OperatorSlug;

export const isDateTimeFormat = (format: string | undefined) =>
	format?.endsWith('date-time');

const typeMap = {
	array: arrayType,
	string: stringType,
	object: objectType,
	boolean: booleanType,
	number: numberType,
} as const;

export const getDataModel = (schema: JSONSchema | undefined) => {
	if (!schema) {
		return null;
	}

	const { format, type } = schema;

	if (schema.enum) {
		return enumType;
	}

	if (schema.oneOf) {
		return oneOfType;
	}

	if (isDateTimeFormat(format)) {
		return dateTimeType;
	}

	const typeSet = Array.isArray(type) ? type : [type];
	// Find the first type we can render, based on the typeMap preference order.
	// TODO: Add handling for 'null` type.
	const dataTypeKey = (
		Object.keys(typeMap) as Array<keyof typeof typeMap>
	).find((t) => typeSet.includes(t));
	if (!dataTypeKey) {
		return null;
	}

	const dataType = typeMap[dataTypeKey];
	return dataType;
};
