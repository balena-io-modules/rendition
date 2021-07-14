import { FormatValidator, FormatDefinition } from 'ajv';
import { UiSchema as rjsfUiSchema } from '@rjsf/core';
import { Widget } from './widgets/widget-util';
export { JSONSchema7 as JSONSchema } from 'json-schema';

export const JsonTypes = {
	array: 'array',
	object: 'object',
	number: 'number',
	integer: 'integer',
	string: 'string',
	boolean: 'boolean',
	null: 'null',
} as const;

export type DefinedValue =
	| number
	| string
	| boolean
	| { [key: string]: any }
	| any[];

export type Value = DefinedValue | null;

export interface UiSchema
	extends Pick<rjsfUiSchema, 'ui:options' | 'ui:order'> {
	'ui:widget'?: string;
	'ui:title'?: string;
	'ui:description'?: string;
	'ui:value'?: Value;
}

export interface Format {
	name: string;
	format: FormatValidator | FormatDefinition;
	widget?: Widget;
}
