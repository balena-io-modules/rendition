import Ajv = require('ajv');
import ajvKeywords = require('ajv-keywords');
import metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json');
import { JSONSchema6 } from 'json-schema';
import every = require('lodash/every');
import findIndex = require('lodash/findIndex');
import isArray = require('lodash/isArray');
import map = require('lodash/map');
import pickBy = require('lodash/pickBy');
import { FilterSignature } from 'rendition';
import * as utils from '../../utils';
import { getDataModel } from '../DataTypes';

const ajv = new Ajv();
ajvKeywords(ajv);
ajv.addMetaSchema(metaSchema6);

const FULL_TEXT_SLUG = 'full_text_search';

export const filter = (
	filters: JSONSchema6 | JSONSchema6[],
	collection: any[],
) => {
	// Remove all schemas that may have been compiled already
	ajv.removeSchema(/^.*$/);

	const validators = isArray(filters)
		? filters.map(s => ajv.compile(s))
		: [ajv.compile(filters)];

	if (isArray(collection)) {
		return collection.filter(m => every(validators, v => v(m)));
	}

	return pickBy(collection, m => every(validators, v => v(m)));
};

export const createFullTextSearchFilter = (
	schema: JSONSchema6,
	term: string,
) => {
	// A schema that matches applies the pattern to each known schema field
	const filter = {
		$id: utils.randomString(),
		title: FULL_TEXT_SLUG,
		anyOf: [
			{
				description: `Full text search is ${term}`,
				anyOf: Object.keys(schema.properties!).map(key => ({
					properties: {
						[key]: {
							type: 'string',
							regexp: {
								pattern: utils.regexEscape(term),
								flags: 'i',
							},
						},
					},
					required: [key],
				})),
			},
		],
	};

	return filter as JSONSchema6;
};

// Update or insert a full text search filter into an array of filters
export const upsertFullTextSearch = (
	schema: JSONSchema6,
	filters: JSONSchema6[] = [],
	term: string,
) => {
	const searchFilter = createFullTextSearchFilter(schema, term);
	const existingSearchIndex = findIndex(filters, { title: FULL_TEXT_SLUG });

	if (existingSearchIndex > -1) {
		filters.splice(existingSearchIndex, 1, searchFilter);
	} else {
		filters.push(searchFilter as JSONSchema6);
	}

	return filters;
};

// Removes a full text search filter from an array of filters
export const removeFullTextSearch = (filters: JSONSchema6[]) =>
	filters.filter(f => f.title !== FULL_TEXT_SLUG);

export const createFilter = (
	schema: JSONSchema6,
	signatures: FilterSignature[],
): JSONSchema6 => {
	const anyOf = signatures.map(({ field, operator, value }) => {
		const subSchema = schema.properties![field] as JSONSchema6;
		const model = getDataModel(subSchema);

		if (!model || !model.operators.hasOwnProperty(operator)) {
			return {};
		}

		return (model.createFilter as (...args: any[]) => JSONSchema6)(
			field,
			operator as any,
			value,
			subSchema,
		);
	});

	return {
		$id: utils.randomString(),
		anyOf,
	};
};

export const decodeFilter = (schema: JSONSchema6, filter: JSONSchema6) => {
	const signatures = filter.anyOf!.map(f => {
		const schemaField = Object.keys(f.properties!).shift()!;
		const subSchema = schema.properties![schemaField] as JSONSchema6;
		const model = getDataModel(subSchema);

		if (!model) {
			return {};
		}

		return (model.decodeFilter as (f: JSONSchema6) => FilterSignature)(f);
	});

	return signatures.filter(s => s !== null);
};

export const getOperators = (schema: JSONSchema6, field: string) => {
	const subSchema = schema.properties![field] as JSONSchema6;
	const model = getDataModel(subSchema);

	if (!model) {
		return [];
	}

	return map(model.operators, (value, key) => ({
		slug: key,
		label: value.getLabel(subSchema),
	}));
};
