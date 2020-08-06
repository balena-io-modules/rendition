import * as React from 'react';
import map from 'lodash/map';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import JsonSchemaRenderer from '../index';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

const ArrayWidget: Widget = ({ value, schema, uiSchema }: WidgetProps) => {
	const items = getArrayItems({ value, schema, uiSchema });
	return (
		<React.Fragment>
			{map(items, (item: WidgetProps, index: number) => {
				return <JsonSchemaRenderer key={index} nested {...item} />;
			})}
		</React.Fragment>
	);
};

ArrayWidget.uiOptions = {
	truncate: UiOption.integer,
};

ArrayWidget.supportedTypes = [JsonTypes.array];

export default ArrayWidget;
