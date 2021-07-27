import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';

import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { formatTimestamp, timeSince } from './widget-util';

export const ElapsedTimeWidget = widgetFactory(
	'ElapsedTime',
	{
		dtFormat: UiOption.string,
	},
	[JsonTypes.string, JsonTypes.number],
)(({ value }) => {
	if (!value) {
		return null;
	}

	return <Txt tooltip={formatTimestamp(value)}>{timeSince(value)}</Txt>;
});
