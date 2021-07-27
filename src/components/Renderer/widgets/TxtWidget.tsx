import * as React from 'react';
import get from 'lodash/get';
import invokeMap from 'lodash/invokeMap';
import isArray from 'lodash/isArray';
import styled from 'styled-components';
import { Txt } from '../../Txt';
import { JsonTypes, Value, UiSchema } from '../types';
import { UiOption } from './ui-options';
import { widgetFactory, formatTimestamp } from './widget-util';

const SingleLineTxt = styled(Txt)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
`;

const getArrayValue = (value: Value[], uiSchema?: UiSchema): string => {
	// Trim array if the 'truncate' option was provided,
	// then comma-join the items into a single string.
	const maxItems = get(uiSchema, ['ui:options', 'truncate'], value.length);
	let arrayString = invokeMap(value.slice(0, maxItems), 'toString').join(', ');
	if (maxItems < value.length) {
		arrayString += ` and ${value.length - maxItems} more...`;
	}
	return arrayString;
};

const DATE_TIME_FORMATS = ['date-time', 'date', 'time'];

const TxtWidget = widgetFactory(
	'Txt',
	{
		dtFormat: UiOption.string,
		bold: UiOption.boolean,
		italic: UiOption.boolean,
		monospace: UiOption.boolean,
		caps: UiOption.boolean,
		align: {
			...UiOption.string,
			enum: [
				'left',
				'right',
				'center',
				'justify',
				'justify-all',
				'start',
				'end',
				'match-parent',
				'inherit',
				'initial',
				'unset',
			],
		},
		whitespace: {
			...UiOption.string,
			enum: [
				'normal',
				'nowrap',
				'pre',
				'pre-line',
				'pre-wrap',
				'initial',
				'inherit',
			],
		},
	},
	[
		JsonTypes.string,
		JsonTypes.null,
		JsonTypes.integer,
		JsonTypes.number,
		JsonTypes.boolean,
		JsonTypes.array,
	],
)(({ value, schema, uiSchema, ...props }) => {
	let displayValue = isArray(value)
		? getArrayValue(value as Array<Exclude<typeof value, any[]>>, uiSchema)
		: value?.toString();
	if (DATE_TIME_FORMATS.includes(schema?.format ?? '')) {
		displayValue =
			displayValue != null ? formatTimestamp(displayValue, uiSchema) : '';
	}
	const Component = get(uiSchema, ['ui:options', 'truncate'])
		? SingleLineTxt
		: Txt;
	return <Component {...props}>{displayValue || ''}</Component>;
});

export default TxtWidget;
