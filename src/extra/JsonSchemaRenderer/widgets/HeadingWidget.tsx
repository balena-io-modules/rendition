import * as React from 'react';
import get from 'lodash/get';
import { Heading } from '../../../components/Heading';
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
	const HeadingComponent = get(Heading, `h${size}`, Heading.h3);
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
