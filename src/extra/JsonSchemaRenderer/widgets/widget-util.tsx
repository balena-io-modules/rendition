import * as React from 'react';
import jsone from 'json-e';
import difference from 'lodash/difference';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { DefinedValue, JSONSchema, UiSchema, Format, Value } from '../types';
import { UiOptions } from './ui-options';

export interface WidgetProps {
	value: DefinedValue;
	schema: JSONSchema;
	uiSchema?: UiSchema;
	extraFormats?: Format[];
	extraContext?: object;
}

export interface Widget {
	(props: WidgetProps): JSX.Element | null;
	uiOptions?: UiOptions;
	supportedTypes?: string[];
}

// This HOC function wraps a Widget component and converts
// the widget's specified 'uiOptions' into props that are
// passed to the widget component.
export function withOptionProps(uiOptions: UiOptions) {
	return (Component: Widget) => {
		const wrapped = (props: WidgetProps) => {
			const extraProps = pick(
				get(props.uiSchema, 'ui:options', {}),
				...keys(uiOptions),
			);
			return <Component {...props} {...extraProps} />;
		};

		wrapped.uiOptions = Component.uiOptions;
		wrapped.supportedTypes = Component.supportedTypes;
		return wrapped;
	};
}

// Runs the UI schema through json-e if the value is
// not an object or an array.
export const transformUiSchema = ({
	value,
	uiSchema,
	extraContext,
}: {
	value?: Value;
	uiSchema: WidgetProps['uiSchema'];
	extraContext: WidgetProps['extraContext'];
}) => {
	return typeof value !== 'object' && !isArray(value)
		? jsone(uiSchema || {}, { source: value, ...extraContext })
		: uiSchema || {};
};

export const getArrayItems = ({
	value,
	schema,
	uiSchema,
	extraContext,
}: WidgetProps): WidgetProps[] => {
	if (!isArray(value)) {
		throw new Error(`Value must be an array (not '${typeof value}')`);
	}
	const maxItems = get(uiSchema, ['ui:options', 'truncate'], value.length);
	const items = value.slice(0, maxItems).map((item) => {
		const itemSchema = get(schema, 'items', {}) as JSONSchema;
		const itemUiSchema = get(uiSchema, 'items', {}) as UiSchema;
		const processedUiSchema = transformUiSchema({
			value: item,
			uiSchema: itemUiSchema,
			extraContext,
		});
		return {
			value: item,
			schema: itemSchema,
			uiSchema: processedUiSchema,
			extraContext,
		};
	});
	if (maxItems < value.length) {
		items.push({
			value: `+ ${value.length - maxItems} more`,
			schema: {
				type: 'string',
			},
			uiSchema: {},
			extraContext,
		});
	}
	return items;
};

export function getObjectPropertyNames({
	value,
	schema,
	uiSchema,
}: WidgetProps): string[] {
	if (typeof value !== 'object') {
		throw new Error(
			`Cannot get object property names from a value of type '${typeof value}'`,
		);
	}
	const schemaPropertyNames =
		get(uiSchema, ['ui:order'], keys(get(schema, 'properties'))) || [];
	const nonSchemaPropertyNames = difference(
		keys(value) || [],
		schemaPropertyNames,
	);
	return schemaPropertyNames.concat(nonSchemaPropertyNames);
}
