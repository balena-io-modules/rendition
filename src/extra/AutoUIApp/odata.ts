import { Methods, OpenApiJson } from './openApiJson';
import PineClientFetch from 'pinejs-client-fetch';
import type { JSONSchema } from '~/components/Renderer/types';
import get from 'lodash/get';

export const pine = new PineClientFetch(
	{
		apiPrefix:
			process.env.REACT_APP_API_HOST || process.env.STORYBOOK_APP_API_HOST,
	},
	{ fetch },
);

export const getSchemaFromLocation = (
	openApiJson: OpenApiJson,
	resourceName: string,
) => {
	const schemaName = Object.keys(openApiJson.components.schemas).find((key) =>
		key.includes(resourceName),
	);
	if (!schemaName) {
		return null;
	}
	return openApiJson.components.schemas[schemaName];
};

export const getAllNaturalPropertiesKeys = (
	properties: JSONSchema['properties'],
) => {
	return Object.entries(properties ?? [])
		.filter(([_key, value]: [string, JSONSchema]) => !!value.type)
		.map(([key]) => key);
};

export const getSelectableOptions = (
	pathObject: Methods | null,
	_parameters: string[],
) => {
	return (
		pathObject?.get?.parameters?.find((p) => p.name === '$select')?.schema
			?.items?.enum ?? []
	);
};

export const getFromRef = (openApiJson: OpenApiJson, ref: string) => {
	const tree = ref.replace('#/', '').split('/');
	return get(openApiJson, tree);
};
