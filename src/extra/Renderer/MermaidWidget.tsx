import * as React from 'react';
import { Mermaid } from '../Mermaid';
import {
	Widget,
	WidgetProps,
} from '../../components/Renderer/widgets/widget-util';
import { JsonTypes } from '../../components/Renderer/types';

export const MermaidWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	if (value == null) {
		return null;
	}
	return <Mermaid width="100%" {...props} value={value.toString()} />;
};

MermaidWidget.displayName = 'Mermaid';

MermaidWidget.uiOptions = {};

MermaidWidget.supportedTypes = [JsonTypes.string];
