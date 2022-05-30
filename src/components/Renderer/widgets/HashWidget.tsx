import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { truncateHash, widgetFactory } from './widget-util';

export const HashWidget = widgetFactory('Hash', {}, [JsonTypes.string])(
	({ value }) => {
		return (
			<Txt code copy={value}>
				{truncateHash(value)}
			</Txt>
		);
	},
);
