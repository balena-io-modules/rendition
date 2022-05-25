import React from 'react';
import { Flex } from '../../Flex';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const PlaceholderTextWidget = widgetFactory('PlaceholderText', {}, [
	JsonTypes.string,
	JsonTypes.number,
	JsonTypes.null,
])(({ value }) => {
	const val =
		value === null || value === ''
			? 'Empty'
			: typeof value !== 'string'
			? value.toString()
			: value;
	return (
		<Flex>
			<Txt
				maxWidth="300px"
				truncate
				title={val}
				{...(!value && { color: 'gray.main' })}
				italic={!value}
			>
				{val}
			</Txt>
		</Flex>
	);
});
