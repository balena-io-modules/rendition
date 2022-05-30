import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const CodeWidget = widgetFactory('Code', {}, [JsonTypes.string])(
	({ value }) => {
		return (
			<Txt
				code
				truncate
				copy={value}
				style={{ maxWidth: '200px' }}
				tooltip={value}
			>
				{value}
			</Txt>
		);
	},
);
