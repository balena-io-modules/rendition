import * as React from 'react';
import map from 'lodash/map';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import { RenditionJsonSchemaRenderer } from '../index';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

const ArrayWidget: Widget = ({
	value,
	schema,
	uiSchema,
	extraContext,
	...rest
}: WidgetProps) => {
	const items = getArrayItems({ value, schema, uiSchema, extraContext });
	return (
		<React.Fragment>
			{map(items, (item: WidgetProps, index: number) => {
				return (
					<RenditionJsonSchemaRenderer key={index} nested {...item} {...rest} />
				);
			})}
		</React.Fragment>
	);
};

ArrayWidget.uiOptions = {
	truncate: UiOption.integer,
};

ArrayWidget.supportedTypes = [JsonTypes.array];

export default ArrayWidget;
