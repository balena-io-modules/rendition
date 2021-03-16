import * as React from 'react';
import { HighlightedName } from '../../HighlightedName';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';
import { generateColorFromString, isLight } from '../../../utils/colorUtils';

const HighlightedNameWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps & { bg?: string; color?: string }) => {
	const bg = props.bg ?? generateColorFromString(value.toString());
	const color = props.color ?? (isLight(bg) ? '#000' : '#FFF');
	return (
		<HighlightedName {...props} bg={bg} color={color}>
			{value.toString()}
		</HighlightedName>
	);
};

HighlightedNameWidget.displayName = 'HighlightedName';

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
