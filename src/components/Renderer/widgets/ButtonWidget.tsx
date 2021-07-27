import * as React from 'react';
import { Button } from '../../Button';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const ButtonWidget = widgetFactory(
	'Button',
	{
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
	},
	[JsonTypes.string, JsonTypes.boolean, JsonTypes.integer, JsonTypes.boolean],
)(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	return <Button {...props}>{value.toString()}</Button>;
});

export default ButtonWidget;
