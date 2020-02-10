import * as temen from 'balena-temen';
import { JSONSchema6 } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import set from 'lodash/set';

// Given a JSON Schema, find all fields that have a formula field, evaluate the
// formula and then update the provided value with the result
const runFormulas = (schema: JSONSchema6, value: any) => {
	const data = cloneDeep(value);

	replaceDataWithFormulaContent(schema, data);

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

const replaceDataWithFormulaContent = (schema: JSONSchema6, data: any) => {
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
	keys.forEach(formula => {
		const fullPath = formula.path;
		const formulaText = formula.formula;

		if (!fullPath.includes('.items.')) {
			set(data, fullPath, formulaText);
		} else {
			const pathFragments = fullPath.split('.items.');
			replaceArrayWithFormulaContent(pathFragments, data, formulaText);
		}
	});
};

const replaceArrayWithFormulaContent = (
	pathFragments: string[],
	data: any,
	formulaText: string,
) => {
	const firstFragment = pathFragments[0];
	const lastFragment = pathFragments[1];
	const array = data[firstFragment] || [];
	if (pathFragments.length > 2) {
		const subFragments = pathFragments.slice(1, pathFragments.length);
		array.forEach((item: any) => {
			replaceArrayWithFormulaContent(subFragments, item, formulaText);
		});
	} else {
		array.forEach((item: any) => {
			set(item, lastFragment, formulaText);
		});
	}
};

const getFormulaKeys = (obj: any, prefix: string = '') => {
	const keys = Object.keys(obj);
	prefix = prefix ? prefix + '.' : '';
	return keys.reduce((result, key) => {
		if (isPlainObject(obj[key])) {
			result = result.concat(getFormulaKeys(obj[key], prefix + key));
		} else if (key === '$$formula') {
			result.push(prefix + key);
		}
		return result;
	}, [] as string[]);
};

export { defaultValueForSchema, runFormulas };
