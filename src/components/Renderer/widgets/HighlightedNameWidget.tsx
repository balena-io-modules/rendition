import * as React from 'react';
import get from 'lodash/get';
import { HighlightedName } from '../../HighlightedName';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';
import { generateColorFromString, isLight } from '../../../utils/colorUtils';

const HighlightedNameWidget = widgetFactory(
	'HighlightedName',
	{
		bg: UiOption.string,
		color: UiOption.string,
	},
	[JsonTypes.string, JsonTypes.integer, JsonTypes.number, JsonTypes.boolean],
)(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	const bg = get(props, 'bg', generateColorFromString(value.toString()));
	const color = get(props, 'color', isLight(bg) ? '#000' : '#FFF');
	return (
		<HighlightedName {...props} bg={bg} color={color}>
			{value.toString()}
		</HighlightedName>
	);
});

export default HighlightedNameWidget;
