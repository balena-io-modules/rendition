import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Flex } from '../../Flex';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const BooleanAsIconWidget = widgetFactory('BooleanAsIcon', {}, [
	JsonTypes.boolean,
	JsonTypes.null,
])(({ value }) => {
	const text = value ? 'true' : 'false';
	return (
		<Flex alignItems="center">
			<FontAwesomeIcon icon={value ? faCheckCircle : faTimesCircle} />{' '}
			<Txt ml="1">{text}</Txt>
		</Flex>
	);
});
