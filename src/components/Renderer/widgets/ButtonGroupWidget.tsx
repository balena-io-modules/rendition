import * as React from 'react';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import { ButtonGroup } from '../../ButtonGroup';
import {
	Widget,
	WidgetProps,
	getArrayItems,
	withOptionProps,
} from './widget-util';
import { JsonTypes } from '../types';
import ButtonWidget from './ButtonWidget';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

const validItemTypes = ['string', 'integer', 'number'];

const WrappedButtonWidget = ButtonWidget.uiOptions
	? withOptionProps(ButtonWidget.uiOptions)(ButtonWidget)
	: ButtonWidget;

const ButtonGroupWidget: Widget = ({
	value,
	schema,
	uiSchema,
	extraContext,
	extraFormats,
	...props
}: WidgetProps) => {
	if (!isArray(value)) {
		throw new Error(
			`ButtonGroupWidget cannot be used to render a value of type '${typeof value}'`,
		);
	}
	const itemType =
		((schema.items as JSONSchema7)?.type as JSONSchema7TypeName) ?? 'undefined';
	if (!validItemTypes.includes(itemType)) {
		throw new Error(
			`ButtonGroupWidget cannot be used to render an array of items of type ${itemType}`,
		);
	}
	const items = getArrayItems({ value, schema, uiSchema, extraContext });
	return (
		<ButtonGroup {...props}>
			{map(items, (item: WidgetProps, index: number) => (
				<WrappedButtonWidget
					key={index}
					{...item}
					extraFormats={extraFormats}
				/>
			))}
		</ButtonGroup>
	);
};

ButtonGroupWidget.displayName = 'ButtonGroup';

ButtonGroupWidget.uiOptions = {};

ButtonGroupWidget.supportedTypes = [JsonTypes.array];

export default ButtonGroupWidget;
