import * as React from 'react';
import get from 'lodash/get';
import { Link } from '../../../components/Link';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const LinkWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	let href = get(props, 'href', value.toString());
	if (get(schema, 'format') === 'email') {
		href = `mailto:${href.replace(/^mailto:/, '')}`;
	}
	return (
		<Link {...props} href={href}>
			{value.toString()}
		</Link>
	);
};

LinkWidget.displayName = 'Link';

LinkWidget.uiOptions = {
	blank: UiOption.boolean,
	download: UiOption.string,
	href: UiOption.string,
	rel: UiOption.string,
	type: UiOption.string,
};

LinkWidget.supportedTypes = [JsonTypes.string];

export default LinkWidget;
