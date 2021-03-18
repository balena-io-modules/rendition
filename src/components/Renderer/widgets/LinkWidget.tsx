import * as React from 'react';
import { Link } from '../../Link';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const LinkWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps & { href?: string; format?: string }) => {
	let href = props.href ?? value.toString();
	if (schema.format === 'email') {
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
