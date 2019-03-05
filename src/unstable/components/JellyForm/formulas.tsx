import * as temen from 'balena-temen';
import { JSONSchema6 } from 'json-schema';
import cloneDeep = require('lodash/cloneDeep');
import get = require('lodash/get');
import isPlainObject = require('lodash/isPlainObject');
import merge = require('lodash/merge');
import set = require('lodash/set');

const getFormulaKeys = function(obj: any, prefix: string = '') {
	const keys = Object.keys(obj);
	prefix = prefix ? prefix + '.' : '';
	return keys.reduce(
		(result, key) => {
			if (isPlainObject(obj[key])) {
				result = result.concat(getFormulaKeys(obj[key], prefix + key));
			} else if (key === '$$formula') {
				result.push(prefix + key);
			}
			return result;
		},
		[] as string[],
	);
};

// Given a JSON Schema, find all fields that have a formula field, evaluate the
// formula and then update the provided value with the result
const runFormulas = (schema: JSONSchema6, value: any) => {
	// Start by cloning the value to avoid any awkward mutation bugs
	const data = cloneDeep(value);

	// Find all the keypaths that use formulas
	const keys = getFormulaKeys(schema).map(path => {
		return {
			formula: get(schema, path),
			path: path.replace(/properties\./g, ''),
		};
	});

	// Replace each field that is the result of a formula with the formula itself.
	// This is done because the formula may reference other fields in the data
	// object, and they all need to be present when running the object through
	// temen.
	keys.forEach(y => {
		set(data, y.path, y.formula);
	});

	let evaluate;

	// Attempt to evaluate the final data object containing formulas, if there is
	// an error, then set the result to the original value.
	try {
		evaluate = temen.evaluate(data);
	} catch (e) {
		console.error('Caught error when evaluating formulas', e);
		evaluate = value;
	}
	const startingState = defaultValueForSchema(schema);
	return merge(startingState, value, evaluate);
};

const defaultValueForSchema = (schema: JSONSchema6) => {
	return schema.type === 'array' ? [] : {};
};

export { defaultValueForSchema, runFormulas };
