import { UiSchema, JSONSchema } from '../types';
import {
	first,
	forEach,
	get,
	without,
	uniq,
	castArray,
	keys,
	cloneDeep,
} from 'lodash';
import widgets from '../widgets';
import { getWidget, getType, JsonSchemaRendererProps } from '../index';
import { WidgetWrapperUiOptions, getObjectPropertyNames } from '../widgets';
import { Value } from '../types';

type UiSchemaMetaSchema = {
	title?: string;
	description?: string;
	type: string | string[];
	properties: {
		[key: string]: any;
	};
};

const baseMetaSchema: UiSchemaMetaSchema = {
	title: 'JsonSchemaRenderer UI Schema',
	type: ['object', 'null'],
	properties: {
		'ui:title': {
			type: ['string', 'null'],
		},
		'ui:description': {
			type: ['string', 'null'],
		},
		'ui:value': {
			type: ['string', 'object', 'null'],
		},
		'ui:options': {
			type: 'object',
		},
	},
};

export const generateUiSchemaMetaSchema = ({
	value,
	uiSchema,
	schema,
}: Pick<
	JsonSchemaRendererProps,
	'value' | 'schema' | 'uiSchema'
>): UiSchemaMetaSchema => {
	// The value may be overridden in the UI Schema
	const processedValue = get(uiSchema, 'ui:value', value);
	const type = getType(processedValue);
	const metaSchema = cloneDeep(baseMetaSchema);

	if (type === 'object') {
		metaSchema.properties['ui:order'] = {
			type: ['array'],
			items: {
				type: 'string',
				enum: keys(schema.properties).concat(['*']),
			},
		};

		const propertyNames = getObjectPropertyNames({
			value: value || '',
			schema,
			uiSchema: uiSchema || {},
		});
		// Recursively build up the UI schema meta schema for each property of the object
		forEach(propertyNames, (propertyName) => {
			const subSchema = get(
				schema,
				['properties', propertyName],
				{},
			) as JSONSchema;
			const subUiSchema = get(uiSchema, propertyName, {}) as UiSchema;
			metaSchema.properties[propertyName] = generateUiSchemaMetaSchema({
				value: get(processedValue, propertyName),
				schema: typeof subSchema === 'boolean' ? {} : subSchema,
				uiSchema: subUiSchema,
			});
		});
	} else if (type === 'array') {
		const arrayValue = processedValue as Value[];
		// Create the UI schema meta schema for the array items
		const itemsUiSchema = get(uiSchema, 'items', {});
		const itemsSchema = get(schema, 'items', {});
		metaSchema.properties.items = generateUiSchemaMetaSchema({
			value: first(arrayValue),
			schema: typeof itemsSchema === 'boolean' ? {} : itemsSchema,
			uiSchema: itemsUiSchema,
		});
	}

	// Populate the valid widget types for the specified data type
	if (type) {
		const widgetKeys: string[] = [];
		castArray(type).reduce((acc, t) => {
			acc.push(...keys(widgets[t]));
			return acc;
		}, widgetKeys);
		metaSchema.properties['ui:widget'] = {
			type: 'string',
			enum: without(uniq(widgetKeys), 'default'),
		};
	}

	// Populate the options for the widget that will be used
	// (or the default widget for that data type if no widget is specified)
	const widget = getWidget(processedValue, get(uiSchema, 'ui:widget'));
	metaSchema.properties['ui:options'] = {
		type: 'object',
		properties: {
			...WidgetWrapperUiOptions,
			...widget.uiOptions,
		},
	};

	return metaSchema;
};
