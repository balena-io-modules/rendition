import * as React from 'react';
import { Heading } from '../../Heading';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

interface HeadingWidgetProps extends WidgetProps {
	size: 1 | 2 | 3 | 4 | 5 | 6;
}

const HeadingWidget: Widget = ({
	value,
	schema,
	uiSchema,
	size,
	...props
}: HeadingWidgetProps) => {
	const HeadingComponent = Heading[`h${size}` as const] ?? Heading.h3;
	return <HeadingComponent {...props}>{value.toString()}</HeadingComponent>;
};

HeadingWidget.displayName = 'Heading';

HeadingWidget.uiOptions = {
	size: {
		...UiOption.number,
		enum: [1, 2, 3, 4, 5, 6],
	},
};

HeadingWidget.supportedTypes = [JsonTypes.string];

export default HeadingWidget;
