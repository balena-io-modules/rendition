import * as React from 'react';
import get from 'lodash/get';
import invokeMap from 'lodash/invokeMap';
import isArray from 'lodash/isArray';
import styled from 'styled-components';
import Txt from '../../../components/Txt';
import { JsonTypes, Value, UiSchema } from '../types';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';

const SingleLineTxt = styled(Txt)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
`;

const getArrayValue = (value: Value[], uiSchema: UiSchema): string => {
	// Trim array if the 'truncate' option was provided,
	// then comma-join the items into a single string.
	const maxItems = get(uiSchema, ['ui:options', 'truncate'], value.length);
	let arrayString = invokeMap(value.slice(0, maxItems), 'toString').join(', ');
	if (maxItems < value.length) {
		arrayString += ` and ${value.length - maxItems} more...`;
	}
	return arrayString;
};

const TxtWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	const displayValue = isArray(value)
		? getArrayValue(value, uiSchema)
		: value?.toString();
	const Component = get(uiSchema, ['ui:options', 'truncate'])
		? SingleLineTxt
		: Txt;
	return <Component {...props}>{displayValue || ''}</Component>;
};

TxtWidget.uiOptions = {
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
};

TxtWidget.supportedTypes = [
	JsonTypes.string,
	JsonTypes.null,
	JsonTypes.integer,
	JsonTypes.number,
	JsonTypes.boolean,
	JsonTypes.array,
];

export default TxtWidget;
