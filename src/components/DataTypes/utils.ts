import { OperatorSlugs } from '.';
import { Operator } from '../Filters/SchemaSieve';
import { JSONSchema } from '../Renderer/types';

export const getJsonDescription = (
	title: string | undefined,
	field: string,
	operator: Operator<OperatorSlugs>,
	value: string,
	label: string | undefined,
	refScheme: string | undefined,
) => {
	return JSON.stringify({
		title,
		field,
		operator,
		value,
		label,
		refScheme,
	});
};

export type CreateFilter<TOperatorSlugs> = (
	field: string,
	operator: Operator<TOperatorSlugs>,
	value: any,
	subSchema: JSONSchema,
	refScheme?: string,
) => JSONSchema;
