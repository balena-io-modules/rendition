import React from 'react';
import { useLocation } from 'react-router';
import { AutoUIModel, AutoUIBaseResource } from '../AutoUI/schemaOps';
import { JSONSchema } from '../../components/Renderer/types';

import { OpenApiJson } from './openApiJson';
import {
	getAllNaturalPropertiesKeys,
	getSelectableOptions,
	getSchemaFromLocation,
	pine,
} from './odata';
import { useRequest } from '../../hooks/useRequest';
import { AutoUI } from '../AutoUI';
import { history, ObjectFromEntries } from '../AutoUI/utils';

interface ContentProps {
	openApiJson: OpenApiJson;
}

const updateSchema = (schema: JSONSchema) => {
	if (!schema.properties) {
		return schema;
	}
	// Add readable "title" on all properties
	const newSchema = {
		...schema,
		properties: Object.entries(schema.properties).reduce(
			(acc, [key, value]) =>
				typeof value === 'object'
					? { ...acc, [key]: { ...value, title: key.split('_').join(' ') } }
					: { ...acc, [key]: value },
			{},
		),
	};
	return newSchema;
};

const generateModel = (
	schema: JSONSchema,
	resourceName: string,
	naturalPropertiesKeys: string[],
) => {
	const [firstPropertyKey, ...otherPropertyKeys] = naturalPropertiesKeys;
	return {
		resource: resourceName,
		schema: updateSchema(schema),
		permissions: {
			read: [firstPropertyKey, ...otherPropertyKeys],
			create: [],
			update: [],
			delete: false,
		},
		priorities: {
			primary: [firstPropertyKey],
			secondary: [...otherPropertyKeys],
			tertiary: [],
		},
	} as AutoUIModel<AutoUIBaseResource<unknown>>;
};

export const Content = ({ openApiJson }: ContentProps) => {
	const { pathname } = useLocation();
	const resourceName = pathname.replace(/^\/([^\/]*).*$/, '$1');
	const id = pathname.substring(pathname.lastIndexOf('/') + 1);
	const endsWithValidId = !isNaN(parseInt(id, 10));
	const schema = getSchemaFromLocation(openApiJson, resourceName);
	const naturalPropertiesKeys = getAllNaturalPropertiesKeys(schema?.properties);
	const correspondingPath = !endsWithValidId
		? openApiJson.paths[`/${resourceName}`]
		: openApiJson.paths[`/${resourceName}({id})`];

	const [data] = useRequest(
		async () =>
			await pine.get({
				resource: resourceName,
				options: {
					...(endsWithValidId && { id }),
					$select: [...getSelectableOptions(correspondingPath, [])],
				},
			}),
		[openApiJson, pathname],
		{ polling: false },
	);

	const model = React.useMemo(() => {
		if (!schema) {
			return null;
		}
		return generateModel(schema, resourceName, naturalPropertiesKeys);
	}, [schema, resourceName, naturalPropertiesKeys]);

	if (!model) {
		return <>Could not generate a model</>;
	}

	if (!(data as any[])?.length) {
		return <>No data</>;
	}

	// TODO: since we don't have a way to render an object without a format yet, we will filter it.
	// In theory we are already doing it in getAllNaturalPropertiesKeys method, but contract it appear to be a type string even if it's not.
	const [firstEntity, ...otherEntities] = (data as any[]).map((obj) =>
		ObjectFromEntries(
			Object.entries(obj).filter(([_, v]) => !!v && typeof v !== 'object'),
		),
	);

	return (
		<AutoUI
			model={model}
			data={endsWithValidId ? firstEntity : [firstEntity, ...otherEntities]}
			{...(!endsWithValidId && {
				onEntityClick: (entity) => history.push(`${pathname}/${entity.id}`),
			})}
		/>
	);
};
