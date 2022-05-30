import React from 'react';
import { Copy } from '../../Copy';
import { Flex } from '../../Flex';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const DisabledTextWidget = widgetFactory('DisabledText', {}, [
	JsonTypes.string,
	JsonTypes.number,
])(({ value }) => {
	const val = typeof value !== 'string' ? value.toString() : value;
	return (
		<Flex>
			<Txt maxWidth="300px" truncate title={val} color="#b3b6b9" monospace>
				{val}
			</Txt>
			{val.length > 45 && <Copy content={val} />}
		</Flex>
	);
});
