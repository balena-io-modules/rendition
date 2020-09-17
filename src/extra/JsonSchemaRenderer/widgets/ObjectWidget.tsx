import * as React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import { Widget, WidgetProps, getObjectPropertyNames } from './widget-util';
import { JsonTypes } from '../types';
import { RenditionJsonSchemaRenderer } from '../index';

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
					value: get(value, key),
					schema: get(schema, ['properties', key]),
					uiSchema: get(uiSchema, key),
				};
				return (
					<RenditionJsonSchemaRenderer
						key={key}
						nested
						valueKey={key}
						{...subProps}
						{...rest}
					/>
				);
			})}
		</React.Fragment>
	);
};

ObjectWidget.displayName = 'Object';

ObjectWidget.supportedTypes = [JsonTypes.object];

export default ObjectWidget;
