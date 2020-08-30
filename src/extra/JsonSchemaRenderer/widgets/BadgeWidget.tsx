import * as React from 'react';
import get from 'lodash/get';
import Badge from '../../../components/Badge';
import { UiOption } from './ui-options';
import { Widget, WidgetProps, stringToNumber } from './widget-util';
import { JsonTypes } from '../types';

const BadgeWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	const shade = get(props, 'shade', stringToNumber(value.toString(), 23));
	return (
		<Badge {...props} shade={shade}>
			{value.toString()}
		</Badge>
	);
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
