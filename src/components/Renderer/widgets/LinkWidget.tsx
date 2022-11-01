import * as React from 'react';
import get from 'lodash/get';
import { Link } from '../../Link';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const LinkWidget = widgetFactory(
	'Link',
	{
		blank: UiOption.boolean,
		download: UiOption.string,
		href: UiOption.string,
		rel: UiOption.string,
		type: UiOption.string,
	},
	[JsonTypes.string],
)(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	let href = get(props, 'href', value.toString());
	if (href != null && get(schema, 'format') === 'email') {
		href = `mailto:${href.replace(/^mailto:/, '')}`;
	}
	return (
		<Link {...props} href={href}>
			{value.toString()}
		</Link>
	);
});

export default LinkWidget;
