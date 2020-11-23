import * as React from 'react';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import map from 'lodash/map';
import { DropDownButton } from '../../../components/DropDownButton';
import { Widget, WidgetProps, getArrayItems } from './widget-util';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';
import { RenditionJsonSchemaRenderer } from '../index';

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
	const itemType = get(schema, ['items', 'type'], 'undefined');
	if (!validItemTypes.includes(itemType)) {
		throw new Error(
			`DropDownButtonWidget cannot be used to render an array of items of type ${itemType}`,
		);
	}
	const items = getArrayItems({ value, schema, uiSchema, extraContext });
	return (
		<DropDownButton {...props}>
			{map(items, (item: WidgetProps, index: number) => (
				<RenditionJsonSchemaRenderer
					key={index}
					{...item}
					extraFormats={extraFormats}
				/>
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
