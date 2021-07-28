import * as React from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import { Flex } from '../../Flex';
import { widgetFactory, getArrayItems } from './widget-util';
import { Renderer } from '../index';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

const ArrayWidget = widgetFactory(
	'Array',
	{
		orientation: {
			...UiOption.string,
			enum: ['vertical', 'horizontal'],
		},
		truncate: UiOption.integer,
	},
	[JsonTypes.array],
)(({ value, schema, uiSchema, extraContext, extraFormats, ...rest }) => {
	const items = getArrayItems({
		value,
		schema,
		uiSchema,
		extraContext,
		extraFormats,
	});
	return (
		<Flex
			flexDirection={
				get(uiSchema, ['ui:options', 'orientation']) === 'horizontal'
					? 'row'
					: 'column'
			}
			flexWrap="wrap"
		>
			{map(items, (item, index) => {
				return <Renderer key={index} nested {...item} {...rest} />;
			})}
		</Flex>
	);
});

export default ArrayWidget;
