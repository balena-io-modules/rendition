import * as React from 'react';
import noop from 'lodash/noop';
import { Checkbox } from '../../../components/Checkbox';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const CheckboxWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Checkbox {...props} checked={Boolean(value)} onChange={noop} />;
};

CheckboxWidget.displayName = 'Checkbox';

CheckboxWidget.uiOptions = {
	label: UiOption.string,
	reverse: UiOption.boolean,
	toggle: UiOption.boolean,
};

CheckboxWidget.supportedTypes = [JsonTypes.boolean];

export default CheckboxWidget;
