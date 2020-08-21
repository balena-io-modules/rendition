import jsone from 'json-e';
import { UiSchema, JSONSchema } from '../types';
import first from 'lodash/first';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import castArray from 'lodash/castArray';
import keys from 'lodash/keys';
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

const getBaseMetaSchema = (): UiSchemaMetaSchema => ({
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
});

type MetaSchemaArgs = Pick<
	JsonSchemaRendererProps,
	'value' | 'schema' | 'uiSchema' | 'extraContext'
>;

// Create the UI schema meta schema for the array items
const generateArrayMetaSchema = (
	metaSchema: UiSchemaMetaSchema,
	{ value, schema, uiSchema, extraContext }: MetaSchemaArgs,
) => {
	const arrayValue = value as Value[];
	const itemsUiSchema = get(uiSchema, 'items', {});
	const itemsSchema = get(schema, 'items', {});
	metaSchema.properties.items = generateUiSchemaMetaSchema({
		value: first(arrayValue),
		schema: typeof itemsSchema === 'boolean' ? {} : itemsSchema,
		uiSchema: itemsUiSchema,
		extraContext,
	});
};

const generateObjectMetaSchema = (
	metaSchema: UiSchemaMetaSchema,
	{ value, schema, uiSchema, extraContext }: MetaSchemaArgs,
) => {
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
			value: get(value, propertyName),
			schema: typeof subSchema === 'boolean' ? {} : subSchema,
			uiSchema: subUiSchema,
			extraContext,
		});
	});
};

const setWidgetOptions = (metaSchema: UiSchemaMetaSchema, type: string) => {
	const widgetKeys: string[] = [];
	castArray(type).reduce((acc, t) => {
		acc.push(...keys(widgets[t]));
		return acc;
	}, widgetKeys);
	metaSchema.properties['ui:widget'] = {
		type: 'string',
		enum: without(uniq(widgetKeys), 'default'),
	};
};

// Populate the options for the widget that will be used
// (or the default widget for that data type if no widget is specified)
const setUiOptions = (
	metaSchema: UiSchemaMetaSchema,
	{ value, uiSchema }: MetaSchemaArgs,
) => {
	const widget = getWidget(value, get(uiSchema, 'ui:widget'));
	metaSchema.properties['ui:options'] = {
		type: 'object',
		properties: {
			...WidgetWrapperUiOptions,
			...widget.uiOptions,
		},
	};
};

const evalulateTopLevelUiProps = ({
	value,
	uiSchema,
	extraContext,
}: Pick<MetaSchemaArgs, 'value' | 'uiSchema' | 'extraContext'>) => {
	// Only run the top-level 'ui:' props through the jsone evaluator
	const trimmedUiSchema = pickBy(uiSchema, (_, k) => k.startsWith('ui:'));
	const processedUiSchema = jsone(trimmedUiSchema, {
		source: value,
		...extraContext,
	});
	return merge({}, uiSchema, processedUiSchema);
};

export const generateUiSchemaMetaSchema = ({
	value: unprocessedValue,
	uiSchema,
	schema,
	extraContext,
}: MetaSchemaArgs): UiSchemaMetaSchema => {
	const metaSchema = getBaseMetaSchema();
	const processedUiSchema = evalulateTopLevelUiProps({
		value: unprocessedValue,
		uiSchema,
		extraContext,
	});
	const input = {
		// The value may be overridden in the UI Schema
		value: get(processedUiSchema, 'ui:value', unprocessedValue),
		schema,
		uiSchema: processedUiSchema,
		extraContext,
	};
	const type = getType(input.value);

	if (type === 'object') {
		generateObjectMetaSchema(metaSchema, input);
	} else if (type === 'array') {
		generateArrayMetaSchema(metaSchema, input);
	}

	// Populate the valid widget types for the specified data type
	if (type) {
		setWidgetOptions(metaSchema, type);
	}

	setUiOptions(metaSchema, input);

	return metaSchema;
};
