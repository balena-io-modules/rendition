import * as React from 'react';
import { Tag } from '../../Tag';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const TagWidget = widgetFactory(
	'Tag',
	{
		operator: UiOption.boolean,
		name: UiOption.string,
	},
	[JsonTypes.string, JsonTypes.integer, JsonTypes.number],
)(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	return <Tag {...props} value={value.toString()} />;
});

export default TagWidget;
