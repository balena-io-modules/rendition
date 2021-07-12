import * as React from 'react';
import { Tag } from '../../Tag';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const TagWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	if (value == null) {
		return null;
	}
	return <Tag {...props} value={value.toString()} />;
};

TagWidget.displayName = 'Tag';

TagWidget.uiOptions = {
	operator: UiOption.boolean,
	name: UiOption.string,
};

TagWidget.supportedTypes = [
	JsonTypes.string,
	JsonTypes.integer,
	JsonTypes.number,
];

export default TagWidget;
