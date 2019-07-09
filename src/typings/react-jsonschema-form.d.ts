declare module 'react-jsonschema-form/lib/utils' {
	import { JSONSchema6 } from 'json-schema';
	import { UiSchema } from 'react-jsonschema-form';

	export function getDefaultRegistry(): any;
	export function getUiOptions(schema: UiSchema): any;
	export function orderProperties(
		properties: string[],
		order: string[] | undefined,
	): any;
	export function retrieveSchema(
		schema: JSONSchema6,
		definitions: any,
		formData: any,
	): any;
}
