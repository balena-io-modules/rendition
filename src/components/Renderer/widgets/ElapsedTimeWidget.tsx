import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';

import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { formatTimestamp, timeSince } from './widget-util';

export const ElapsedTimeWidget: Widget = ({
	value,
}: Omit<WidgetProps, 'value'> & { value: any }) => {
	if (!value) {
		return null;
	}

	return <Txt tooltip={formatTimestamp(value)}>{timeSince(value)}</Txt>;
};

ElapsedTimeWidget.displayName = 'ElapsedTime';
ElapsedTimeWidget.uiOptions = {
	dtFormat: UiOption.string,
};
ElapsedTimeWidget.supportedTypes = [JsonTypes.string, JsonTypes.number];
