import React from 'react';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { widgetFactory } from './widget-util';
import { useTranslation } from '../../../hooks/useTranslation';

export const DisabledTextWidget = widgetFactory('DisabledText', {}, [
	JsonTypes.string,
	JsonTypes.number,
	JsonTypes.null,
])(({ value }) => {
	const { t } = useTranslation();
	const val =
		value != null && typeof value !== 'string' ? value.toString() : value;
	return (
		<Txt
			maxWidth="350px"
			truncate
			title={val ?? t('info.not_defined')}
			color="#b3b6b9"
			monospace
			copy={val != null && val.length > 45 ? val : undefined}
			italic={val == null}
			px={1}
		>
			{val ?? t('info.not_defined')}
		</Txt>
	);
});
