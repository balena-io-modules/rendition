import { JSONSchema6 } from 'json-schema';
import * as arrayType from './array';
import * as booleanType from './boolean';
import * as dateTimeType from './date-time';
import * as enumType from './enum';
import * as numberType from './number';
import * as objectType from './object';
import * as stringType from './string';

export const getDataModel = (schema?: JSONSchema6) => {
	if (!schema) {
		return null;
	}

	const { format, type } = schema;

	if (schema.enum) {
		return enumType;
	}
	if (type === 'array') {
		return arrayType;
	}
	if (type === 'string') {
		if (format === 'date-time') {
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
