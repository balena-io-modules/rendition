import * as React from 'react';
import map from 'lodash/map';
import { List } from '../../List';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import { Renderer } from '../index';
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
	extraFormats,
	extraContext,
	...props
}: ListWidgetProps) => {
	const items = getArrayItems({
		value,
		schema,
		uiSchema,
		extraContext,
		extraFormats,
	});
	return (
		<List {...props}>
			{map(items, (item: WidgetProps, index: number) => {
				return (
					<Renderer key={index} nested {...item} extraFormats={extraFormats} />
				);
			})}
		</List>
	);
};

ListWidget.displayName = 'List';

ListWidget.uiOptions = {
	truncate: UiOption.integer,
	ordered: UiOption.boolean,
};

ListWidget.supportedTypes = [JsonTypes.array];

export default ListWidget;
