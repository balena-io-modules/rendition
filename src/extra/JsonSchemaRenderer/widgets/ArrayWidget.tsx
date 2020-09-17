import * as React from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import { Flex } from '../../../components/Flex';
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
		<Flex
			flexDirection={
				get(uiSchema, ['ui:options', 'orientation']) === 'horizontal'
					? 'row'
					: 'column'
			}
			flexWrap="wrap"
		>
			{map(items, (item: WidgetProps, index: number) => {
				return (
					<RenditionJsonSchemaRenderer key={index} nested {...item} {...rest} />
				);
			})}
		</Flex>
	);
};

ArrayWidget.displayName = 'Array';

ArrayWidget.uiOptions = {
	orientation: {
		...UiOption.string,
		enum: ['vertical', 'horizontal'],
	},
	truncate: UiOption.integer,
};

ArrayWidget.supportedTypes = [JsonTypes.array];

export default ArrayWidget;
