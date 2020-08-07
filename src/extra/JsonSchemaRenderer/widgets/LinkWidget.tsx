import * as React from 'react';
import Link from '../../../components/Link';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const LinkWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Link {...props}>{value.toString()}</Link>;
};

LinkWidget.uiOptions = {
	blank: UiOption.boolean,
	download: UiOption.string,
	href: UiOption.string,
	rel: UiOption.string,
	type: UiOption.string,
};

LinkWidget.supportedTypes = [JsonTypes.string];

export default LinkWidget;
