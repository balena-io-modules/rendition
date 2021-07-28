import * as React from 'react';
import noop from 'lodash/noop';
import { Checkbox } from '../../Checkbox';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const CheckboxWidget = widgetFactory(
	'Checkbox',
	{
		label: UiOption.string,
		reverse: UiOption.boolean,
		toggle: UiOption.boolean,
	},
	[JsonTypes.boolean],
)(({ value, schema, uiSchema, ...props }) => {
	return <Checkbox {...props} checked={Boolean(value)} onChange={noop} />;
});

export default CheckboxWidget;
