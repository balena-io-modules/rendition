import * as React from 'react';
import HighlightedName from '../../../components/HighlightedName';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const HighlightedNameWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <HighlightedName {...props}>{value.toString()}</HighlightedName>;
};

HighlightedNameWidget.uiOptions = {
	bg: UiOption.string,
	color: UiOption.string,
};

HighlightedNameWidget.supportedTypes = [
	JsonTypes.string,
	JsonTypes.integer,
	JsonTypes.number,
	JsonTypes.boolean,
];

export default HighlightedNameWidget;
