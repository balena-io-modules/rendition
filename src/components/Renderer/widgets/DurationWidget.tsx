import React from 'react';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';
import { Txt } from '../../Txt';
import { intervalToDuration } from 'date-fns';

export const DurationWidget = widgetFactory('Duration', {}, [JsonTypes.object])(
	({
		value,
	}: {
		value: { start?: number | Date | null; end?: number | Date | null };
	}) => {
		const duration = React.useMemo(() => {
			if (!value.start || !value.end) {
				return '';
			}
			const interval = intervalToDuration({
				start: new Date(value.start),
				end: new Date(value.end),
			});
			if (!interval) {
				return '';
			}
			const customInterval: { [key: string]: string } = {};
			for (const [key, value] of Object.entries(interval)) {
				if (value == null) {
					continue;
				}
				customInterval[key] = value < 10 ? `0${value}` : `${value}`;
			}
			let durationText = '';
			if (!!interval.years) {
				durationText += `${customInterval.years}y `;
			}
			if (durationText.length > 0 || !!interval.months) {
				durationText += `${customInterval.months}m `;
			}
			if (durationText.length > 0 || !!interval.days) {
				durationText += `${customInterval.days}d `;
			}
			customInterval.hours ??= '00';
			customInterval.minutes ??= '00';
			customInterval.seconds ??= '00';
			durationText += `${customInterval.hours}:${customInterval.minutes}:${customInterval.seconds}`;
			return durationText;
		}, []);

		return <Txt>{duration}</Txt>;
	},
);
