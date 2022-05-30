import React from 'react';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';

export const TemperatureWidget = widgetFactory('Temperature', {}, [
	JsonTypes.number,
])(({ value }) => {
	return <>{value ? `~${value}°C` : '-'}</>;
});
