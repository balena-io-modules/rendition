import * as React from 'react';
import { isArray, get, map } from 'lodash';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';
import ButtonWidget from './ButtonWidget';

const validItemTypes = ['string', 'integer', 'number'];

// TODO: how to define UI Schema for items of an array?
// (e.g. so the href prop for each item in the array can be uniquely set)
const ButtonGroupWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	if (!isArray(value)) {
		throw new Error(
			`ButtonGroupWidget cannot be used to render a value of type '${typeof value}'`,
		);
	}
	const itemType = get(schema, ['items', 'type'], 'undefined');
	if (!validItemTypes.includes(itemType)) {
		throw new Error(
			`ButtonGroupWidget cannot be used to render an array of items of type ${itemType}`,
		);
	}
	return (
		<ButtonGroup>
			{map(value, (item) => (
				<Button key={item} {...props}>
					{item.toString()}
				</Button>
			))}
		</ButtonGroup>
	);
};

ButtonGroupWidget.uiOptions = ButtonWidget.uiOptions;

ButtonGroupWidget.supportedTypes = [JsonTypes.array];

export default ButtonGroupWidget;
