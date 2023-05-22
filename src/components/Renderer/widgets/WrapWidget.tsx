import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const WrapWidget = widgetFactory('Wrap', {}, [JsonTypes.string])(
	({ value }) => {
		return (
			<Txt maxWidth="475px" whitespace="normal">
				{value}
			</Txt>
		);
	},
);
