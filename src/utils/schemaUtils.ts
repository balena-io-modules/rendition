import { JSONSchema7 as JSONSchema } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';

/**
 * @name stripSchemaFormats
 * @summary Remove "format" keywords with an unknown value from a JSON schema
 * @function
 * @public
 *
 * @description @summary Remove any "format" keyword that has an unknown value
 * from a JSON schema. Optionally you can provide a whitelist of  formats that
 * should be preserved.
 *
 * @param {Object} schema - The json schema to filter
 * @param {String[]} [whitelist=[]] - An array of formats to preserver
 *
 * @returns {Object} A new schema object
 *
 * @example
 * const schema = {
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 			format: 'uuid'
 * 		},
 * 		bar: {
 * 			type: 'string',
 * 			format: 'email'
 * 		}
 * }
 *
 * const cleanSchema = utils.stripSchemaFormats(schema, [ 'email' ])
 * console.log(cleanSchema) // -->
 * {
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		},
 * 		bar: {
 * 			type: 'string',
 * 			format: 'email'
 * 		}
 * }
 */
export const stripSchemaFormats = (
	schema: JSONSchema,
	whitelist: string[] = [],
) => {
	const newSchema = cloneDeep(schema);

	const _strip = (schema: JSONSchema) => {
		if (schema.format && whitelist.indexOf(schema.format) === -1) {
			delete schema.format;
		}
		if (schema.properties) {
			forEach(schema.properties, (subSchema) => {
				_strip(subSchema as JSONSchema);
			});
		}
		if (schema.items) {
			_strip(schema.items as JSONSchema);
		}
	};

	_strip(newSchema);

	return newSchema;
};

/**
 * @name disallowAdditionalProperties
 * @summary Sets the "additionalProperties" keyword to false in a JSON schema
 * @function
 * @public
 *
 * @description Sets the "additionalProperties" keyword to false in a JSON schema
 *
 * @param {Object} schema - The json schema to filter
 *
 * @returns {Object} A new schema object
 *
 * @example
 * const schema = {
 * 	additionalProperties: true,
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		}
 * }
 *
 * const newSchema = utils.disallowAdditionalProperties(schema)
 * console.log(newSchema) // -->
 * {
 * 	additionalProperties: true,
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		}
 * }
 */
export const disallowAdditionalProperties = (schema: JSONSchema) => {
	const newSchema = cloneDeep(schema);

	const disallow = (schema: JSONSchema) => {
		if (schema.additionalProperties) {
			schema.additionalProperties = false;
		}
		if (schema.properties) {
			forEach(schema.properties, (subSchema) => {
				disallow(subSchema as JSONSchema);
			});
		}
	};

	disallow(newSchema);

	return newSchema;
};
