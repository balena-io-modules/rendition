import * as React from 'react';
import { Markdown } from '../Markdown';
import { widgetFactory } from '../../components/Renderer/widgets/widget-util';
import { JsonTypes } from '../../components/Renderer/types';

export const MarkdownWidget = widgetFactory('Markdown', undefined, [
	JsonTypes.string,
])(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	return <Markdown {...props}>{value.toString()}</Markdown>;
});
