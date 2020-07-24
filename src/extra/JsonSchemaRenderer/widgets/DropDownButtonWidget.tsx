import * as React from 'react';
import { isArray, get, map } from 'lodash';
import DropDownButton from '../../../components/DropDownButton';
import { Widget, WidgetProps } from './widget-util';
import ButtonWidget from './ButtonWidget';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';

const validItemTypes = ['string', 'integer', 'number'];

// TODO: how to define UI Schema for items of an array?
// (e.g. so the href prop for each item in the array can be uniquely set)
const DropDownButtonWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	if (!isArray(value)) {
		throw new Error(
			`DropDownButtonWidget cannot be used to render a value of type '${typeof value}'`,
		);
	}
	const itemType = get(schema, ['items', 'type'], 'undefined');
	if (!validItemTypes.includes(itemType)) {
		throw new Error(
			`DropDownButtonWidget cannot be used to render an array of items of type ${itemType}`,
		);
	}
	return (
		<DropDownButton {...props}>
			{map(value, (item) => (
				<div key={item}>{item.toString()}</div>
			))}
		</DropDownButton>
	);
};

DropDownButtonWidget.uiOptions = {
	...ButtonWidget.uiOptions,
	label: UiOption.string,
};

DropDownButtonWidget.supportedTypes = [JsonTypes.array];

export default DropDownButtonWidget;
