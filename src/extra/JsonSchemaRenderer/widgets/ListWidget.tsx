import * as React from 'react';
import map from 'lodash/map';
import List from '../../../components/List';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import JsonSchemaRenderer from '../index';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

interface ListWidgetProps extends WidgetProps {
	truncate: number;
}

const ListWidget: Widget = ({
	value,
	schema,
	uiSchema,
	truncate,
	...props
}: ListWidgetProps) => {
	const items = getArrayItems({ value, schema, uiSchema });
	return (
		<List {...props}>
			{map(items, (item: WidgetProps, index: number) => {
				return <JsonSchemaRenderer key={index} nested {...item} />;
			})}
		</List>
	);
};

ListWidget.uiOptions = {
	truncate: UiOption.integer,
	ordered: UiOption.boolean,
};

ListWidget.supportedTypes = [JsonTypes.array];

export default ListWidget;
