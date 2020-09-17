import * as React from 'react';
import { Mermaid } from '../../Mermaid';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const MermaidWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Mermaid width="100%" {...props} value={value.toString()} />;
};

MermaidWidget.displayName = 'Mermaid';

MermaidWidget.uiOptions = {};

MermaidWidget.supportedTypes = [JsonTypes.string];

export default MermaidWidget;
