import React from 'react';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';
import { Txt } from '../../Txt';
import { intervalToDuration } from 'date-fns';

export const DurationWidget = widgetFactory('Duration', {}, [JsonTypes.object])(
	({ value }: { value: { start: number | Date; end: number | Date } }) => {
		const duration = React.useMemo(() => {
			const interval = intervalToDuration({
				start: new Date(value.start) ?? 0,
				end: new Date(value.end) ?? 0,
			});
			if (!interval) {
				return '-';
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
