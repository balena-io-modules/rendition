import * as React from 'react';
import { difference, isArray, keys, get, pick } from 'lodash';
import { DefinedValue, JSONSchema, UiSchema } from '../types';
import { UiOptions } from './ui-options';

export interface WidgetProps {
	value: DefinedValue;
	schema: JSONSchema;
	uiSchema: UiSchema;
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

export const getArrayItems = ({
	value,
	schema,
	uiSchema,
}: WidgetProps): WidgetProps[] => {
	if (!isArray(value)) {
		throw new Error(`Value must be an array (not '${typeof value}')`);
	}
	const maxItems = get(uiSchema, ['ui:options', 'truncate'], value.length);
	const items = value.slice(0, maxItems).map((item) => ({
		value: item,
		schema: get(schema, 'items', {}) as JSONSchema,
		uiSchema: get(uiSchema, 'items', {}) as UiSchema,
	}));
	if (maxItems < value.length) {
		items.push({
			value: `+ ${value.length - maxItems} more`,
			schema: {
				type: 'string',
			},
			uiSchema: {},
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
