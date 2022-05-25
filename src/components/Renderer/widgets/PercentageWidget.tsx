import React from 'react';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const PercentageWidget = widgetFactory('Percentage', {}, [
	JsonTypes.string,
	JsonTypes.number,
])(({ value }) => {
	return <>{value ? `${value}%` : '-'}</>;
});
