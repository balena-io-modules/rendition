import * as React from 'react';
import map from 'lodash/map';
import { Widget, WidgetProps, getObjectPropertyNames } from './widget-util';
import { DefinedValue, JSONSchema, JsonTypes, UiSchema } from '../types';
import { Renderer } from '../index';

const ObjectWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...rest
}: WidgetProps) => {
	const propertyNames = getObjectPropertyNames({ value, schema, uiSchema });
	return (
		<React.Fragment>
			{map(propertyNames, (key: string) => {
				const subProps: WidgetProps = {
					value: (value as { [key: string]: any })?.[key] as DefinedValue,
					schema: schema.properties?.[key] as JSONSchema,
					uiSchema: uiSchema?.[key as keyof UiSchema] as UiSchema,
				};
				return (
					<Renderer key={key} nested valueKey={key} {...subProps} {...rest} />
				);
			})}
		</React.Fragment>
	);
};

ObjectWidget.displayName = 'Object';

ObjectWidget.supportedTypes = [JsonTypes.object];

export default ObjectWidget;
