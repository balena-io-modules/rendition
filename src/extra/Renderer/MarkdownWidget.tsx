import * as React from 'react';
import { Markdown } from '../Markdown';
import {
	Widget,
	WidgetProps,
} from '../../components/Renderer/widgets/widget-util';
import { JsonTypes } from '../../components/Renderer/types';

const MarkdownWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Markdown {...props}>{value.toString()}</Markdown>;
};

MarkdownWidget.displayName = 'Markdown';

MarkdownWidget.supportedTypes = [JsonTypes.string];

export default MarkdownWidget;
