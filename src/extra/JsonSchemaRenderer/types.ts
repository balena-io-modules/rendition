import { FormatValidator, FormatDefinition } from 'ajv';
export { JSONSchema7 as JSONSchema } from 'json-schema';

export const JsonTypes = {
	array: 'array',
	object: 'object',
	number: 'number',
	integer: 'integer',
	string: 'string',
	boolean: 'boolean',
	null: 'null',
};

export type DefinedValue =
	| number
	| string
	| boolean
	| { [key: string]: any }
	| any[];

export type Value = DefinedValue | null;

export interface UiSchema {
	title?: string;
	description?: string;
	'ui:widget'?: string;
	'ui:title'?: string;
	'ui:description'?: string;
	'ui:options'?: Value;
	'ui:value'?: Value;
}

export interface Format {
	name: string;
	format: FormatValidator | FormatDefinition;
}
