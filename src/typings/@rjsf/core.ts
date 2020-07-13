declare module '@rjsf/core/dist/cjs/utils' {
	import { JSONSchema7 as JSONSchema } from 'json-schema';
	import { UiSchema } from '@rjsf/core';

	export function getDefaultRegistry(): any;
	export function getUiOptions(schema: UiSchema): any;
	export function orderProperties(
		properties: string[],
		order: string[] | undefined,
	): any;
	export function retrieveSchema(
		schema: JSONSchema,
		definitions: any,
		formData: any,
	): any;
}
