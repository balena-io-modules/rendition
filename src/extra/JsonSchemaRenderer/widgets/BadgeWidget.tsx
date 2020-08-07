import * as React from 'react';
import Badge from '../../../components/Badge';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const BadgeWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Badge {...props}>{value.toString()}</Badge>;
};

BadgeWidget.uiOptions = {
	shade: UiOption.number,
};

BadgeWidget.supportedTypes = [
	JsonTypes.string,
	JsonTypes.integer,
	JsonTypes.number,
	JsonTypes.boolean,
];

export default BadgeWidget;
