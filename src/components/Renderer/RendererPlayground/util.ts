import { UiSchema, JSONSchema, DefinedValue } from '../types';
import first from 'lodash/first';
import forEach from 'lodash/forEach';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import keys from 'lodash/keys';
import { defaultFormats } from '../widgets';
import { getWidget, getType, RendererProps } from '../index';
import { WidgetWrapperUiOptions, getObjectPropertyNames } from '../widgets';
import { transformUiSchema } from '../widgets/widget-util';
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
	title: 'Renderer UI Schema',
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
		'ui:explicit': {
			type: 'boolean',
		},
	},
});

type MetaSchemaArgs = Pick<
	RendererProps,
	'value' | 'schema' | 'uiSchema' | 'extraContext' | 'extraFormats'
>;

// Create the UI schema meta schema for the array items
const generateArrayMetaSchema = (
	metaSchema: UiSchemaMetaSchema,
	{ value, schema, uiSchema, extraContext, extraFormats }: MetaSchemaArgs,
) => {
	const arrayValue = value as Value[];
	const itemsUiSchema = uiSchema?.items ?? {};
	const itemsSchema = (schema.items as JSONSchema) ?? {};
	metaSchema.properties.items = generateUiSchemaMetaSchema({
		value: first(arrayValue),
		schema: typeof itemsSchema === 'boolean' ? {} : itemsSchema,
		uiSchema: itemsUiSchema,
		extraContext,
		extraFormats,
	});
};

const generateObjectMetaSchema = (
	metaSchema: UiSchemaMetaSchema,
	{ value, schema, uiSchema, extraContext, extraFormats }: MetaSchemaArgs,
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
		const subSchema = (schema.properties?.[propertyName] ?? {}) as JSONSchema;
		const subUiSchema = (uiSchema?.[propertyName as keyof UiSchema] ??
			{}) as UiSchema;
		metaSchema.properties[propertyName] = generateUiSchemaMetaSchema({
			value: (value as { [key: string]: any })?.[propertyName] as DefinedValue,
			schema: typeof subSchema === 'boolean' ? {} : subSchema,
			uiSchema: subUiSchema,
			extraContext,
			extraFormats,
		});
	});
};

const setWidgetOptions = (metaSchema: UiSchemaMetaSchema, type: string) => {
	const widgetKeys: string[] = [
		type,
		...defaultFormats
			.filter((x) => x.widget?.supportedTypes?.includes(type))
			.map((x) => x.name),
	];

	metaSchema.properties['ui:widget'] = {
		oneof: [
			{
				type: 'string',
				enum: without(uniq(widgetKeys), 'default'),
			},
			{
				type: 'object',
			},
		],
	};
};

// Populate the options for the widget that will be used
// (or the default widget for that data type if no widget is specified)
const setUiOptions = ({
	metaSchema,
	format,
	input: { value, uiSchema },
}: {
	metaSchema: UiSchemaMetaSchema;
	format?: string;
	input: MetaSchemaArgs;
}) => {
	const widget = getWidget(value, format, uiSchema?.['ui:widget']);
	metaSchema.properties['ui:options'] = {
		type: 'object',
		properties: {
			...WidgetWrapperUiOptions,
			...widget.uiOptions,
		},
	};
};

export const generateUiSchemaMetaSchema = ({
	value: unprocessedValue,
	uiSchema,
	schema,
	extraContext,
	extraFormats,
}: MetaSchemaArgs): UiSchemaMetaSchema => {
	const metaSchema = getBaseMetaSchema();
	const processedUiSchema = transformUiSchema({
		value: unprocessedValue,
		uiSchema,
		extraContext,
	});
	const input = {
		// The value may be overridden in the UI Schema
		value: processedUiSchema['ui:value'] ?? unprocessedValue,
		schema,
		uiSchema: processedUiSchema,
		extraContext,
		extraFormats,
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

	setUiOptions({ metaSchema, format: schema.format, input });

	return metaSchema;
};
