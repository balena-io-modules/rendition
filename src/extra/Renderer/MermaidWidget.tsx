import * as React from 'react';
import { Mermaid } from '../Mermaid';
import { widgetFactory } from '../../components/Renderer/widgets/widget-util';
import { JsonTypes } from '../../components/Renderer/types';

export const MermaidWidget = widgetFactory('Mermaid', {}, [JsonTypes.string])(
	({ value, schema, uiSchema, ...props }) => {
		if (value == null) {
			return null;
		}
		return <Mermaid width="100%" {...props} value={value.toString()} />;
	},
);
