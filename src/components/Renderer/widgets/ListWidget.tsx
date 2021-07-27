import * as React from 'react';
import map from 'lodash/map';
import { List } from '../../List';
import { widgetFactory, getArrayItems } from './widget-util';
import { Renderer } from '../index';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

interface ExtraListWidgetProps {
	truncate: number;
}

const ListWidget = widgetFactory(
	'List',
	{
		truncate: UiOption.integer,
		ordered: UiOption.boolean,
	},
	[JsonTypes.array],
)<object, ExtraListWidgetProps>(
	({
		value,
		schema,
		uiSchema,
		truncate,
		extraFormats,
		extraContext,
		...props
	}) => {
		const items = getArrayItems({
			value,
			schema,
			uiSchema,
			extraContext,
			extraFormats,
		});
		return (
			<List {...props}>
				{map(items, (item, index) => {
					return (
						<Renderer
							key={index}
							nested
							{...item}
							extraFormats={extraFormats}
						/>
					);
				})}
			</List>
		);
	},
);

export default ListWidget;
