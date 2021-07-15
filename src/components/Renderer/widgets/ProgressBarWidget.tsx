import * as React from 'react';
import { ProgressBar } from '../../ProgressBar';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

// Note: this widget works best when the following 'ui:options' are specified:
// 	 flex: 1
//   alignItems: 'stretch'

const ProgressBarWidget: Widget = ({
	value,
	schema,
	uiSchema,
	extraContext,
	extraFormats,
	...props
}: WidgetProps) => {
	if (value == null) {
		return null;
	}
	if (typeof value !== 'number') {
		throw new Error(
			`ProgressBarWidget cannot be used to render a value of type '${typeof value}'`,
		);
	}
	return (
		<ProgressBar {...props} value={value}>
			{value.toFixed(0)}%
		</ProgressBar>
	);
};

ProgressBarWidget.displayName = 'ProgressBar';

ProgressBarWidget.uiOptions = {
	background: UiOption.string,
	primary: UiOption.boolean,
	secondary: UiOption.boolean,
	tertiary: UiOption.boolean,
	quartenary: UiOption.boolean,
	danger: UiOption.boolean,
	warning: UiOption.boolean,
	success: UiOption.boolean,
	info: UiOption.boolean,
	emphasized: UiOption.boolean,
};

ProgressBarWidget.supportedTypes = [JsonTypes.integer, JsonTypes.number];

export default ProgressBarWidget;
