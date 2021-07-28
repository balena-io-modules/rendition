import * as React from 'react';
import get from 'lodash/get';
import { Heading } from '../../Heading';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

interface ExtraHeadingWidgetProps {
	size: 1 | 2 | 3 | 4 | 5 | 6;
}

const HeadingWidget = widgetFactory(
	'Heading',
	{
		size: {
			...UiOption.number,
			enum: [1, 2, 3, 4, 5, 6],
		},
	},
	[JsonTypes.string],
)<object, ExtraHeadingWidgetProps>(
	({ value, schema, uiSchema, size, ...props }) => {
		if (value == null) {
			return null;
		}
		const HeadingComponent = get(Heading, `h${size}`, Heading.h3);
		return <HeadingComponent {...props}>{value.toString()}</HeadingComponent>;
	},
);

export default HeadingWidget;
