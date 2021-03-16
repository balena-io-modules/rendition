import * as React from 'react';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import { DropDownButton } from '../../DropDownButton';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';
import { Renderer } from '../index';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

const validItemTypes = ['string', 'integer', 'number'];

const DropDownButtonWidget: Widget = ({
	value,
	schema,
	uiSchema,
	extraContext,
	extraFormats,
	...props
}: WidgetProps) => {
	if (!isArray(value)) {
		throw new Error(
			`DropDownButtonWidget cannot be used to render a value of type '${typeof value}'`,
		);
	}
	const itemType =
		((schema.items as JSONSchema7)?.type as JSONSchema7TypeName) ?? 'undefined';
	if (!validItemTypes.includes(itemType)) {
		throw new Error(
			`DropDownButtonWidget cannot be used to render an array of items of type ${itemType}`,
		);
	}
	const items = getArrayItems({ value, schema, uiSchema, extraContext });
	return (
		<DropDownButton {...props}>
			{map(items, (item: WidgetProps, index: number) => (
				<Renderer key={index} {...item} extraFormats={extraFormats} />
			))}
		</DropDownButton>
	);
};

DropDownButtonWidget.displayName = 'DropDownButton';

DropDownButtonWidget.uiOptions = {
	label: UiOption.string,
	disabled: UiOption.boolean,
	primary: UiOption.boolean,
	secondary: UiOption.boolean,
	tertiary: UiOption.boolean,
	quarternary: UiOption.boolean,
	danger: UiOption.boolean,
	warning: UiOption.boolean,
	success: UiOption.boolean,
	info: UiOption.boolean,
	emphasized: UiOption.boolean,
	square: UiOption.boolean,
	border: UiOption.boolean,
	joined: UiOption.boolean,
	alignRight: UiOption.boolean,
	listMaxHeight: UiOption.space,
};

DropDownButtonWidget.supportedTypes = [JsonTypes.array];

export default DropDownButtonWidget;
