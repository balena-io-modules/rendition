import * as React from 'react';
import get from 'lodash/get';
import { Badge } from '../../Badge';
import { hashCode } from '../../../utils';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const BadgeWidget = widgetFactory(
	'Badge',
	{
		shade: UiOption.number,
	},
	[JsonTypes.string, JsonTypes.integer, JsonTypes.number, JsonTypes.boolean],
)(({ value, schema, uiSchema, ...props }) => {
	// TODO: check whether we really need this
	if (value == null) {
		return null;
	}
	const shade = get(props, 'shade', hashCode(value.toString(), 23));
	return (
		<Badge {...props} shade={shade}>
			{value.toString()}
		</Badge>
	);
});

export default BadgeWidget;
