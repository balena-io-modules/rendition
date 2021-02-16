import { JSONSchema7 as JSONSchema } from 'json-schema';
import * as arrayType from './array';
import * as booleanType from './boolean';
import * as dateTimeType from './date-time';
import * as enumType from './enum';
import * as numberType from './number';
import * as objectType from './object';
import * as oneOfType from './oneOf';
import * as stringType from './string';

const isDateTimeFormat = (format: string | undefined) =>
	format?.endsWith('date-time');

export const getDataModel = (schema?: JSONSchema) => {
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
	if (type === 'array') {
		return arrayType;
	}
	if (type === 'string') {
		if (isDateTimeFormat(format)) {
			return dateTimeType;
		}
		return stringType;
	}
	if (type === 'object') {
		return objectType;
	}
	if (type === 'boolean') {
		return booleanType;
	}
	if (type === 'number') {
		return numberType;
	}

	return null;
};
