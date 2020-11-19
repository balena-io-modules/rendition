import * as React from 'react';
import { Button } from '../../../components/Button';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const ButtonWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Button {...props}>{value.toString()}</Button>;
};

ButtonWidget.displayName = 'Button';

ButtonWidget.uiOptions = {
	href: UiOption.string,
	target: {
		...UiOption.string,
		enum: ['_blank', '_self', '_parent', '_top'],
	},
	disabled: UiOption.boolean,
	primary: UiOption.boolean,
	secondary: UiOption.boolean,
	tertiary: UiOption.boolean,
	quarternary: UiOption.boolean,
	danger: UiOption.boolean,
	warning: UiOption.boolean,
	success: UiOption.boolean,
	info: UiOption.boolean,
	light: UiOption.boolean,
	outline: UiOption.boolean,
	plain: UiOption.boolean,
	underline: UiOption.boolean,
};

ButtonWidget.supportedTypes = [
	JsonTypes.string,
	JsonTypes.boolean,
	JsonTypes.integer,
	JsonTypes.boolean,
];

export default ButtonWidget;
