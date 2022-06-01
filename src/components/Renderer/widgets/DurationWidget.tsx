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
			Object.entries(interval).forEach(([key, value]) => {
				if (value != null && value < 10) {
					customInterval[key] = `0${value}`;
				} else {
					customInterval[key] = `${value}`;
				}
			});
			let durationText = '';
			if (!!interval.years) {
				durationText += `${customInterval.years}y `;
			}
			if (!!interval.years || !!interval.months) {
				durationText += `${customInterval.months}m `;
			}
			if (!!interval.years || !!interval.months || !!interval.days) {
				durationText += `${customInterval.days}d `;
			}
			durationText += `${customInterval.hours}:${customInterval.minutes}:${customInterval.seconds}`;
			return durationText;
		}, []);

		return <Txt>{duration}</Txt>;
	},
);
