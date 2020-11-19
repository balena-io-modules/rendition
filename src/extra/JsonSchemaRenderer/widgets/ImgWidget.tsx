import * as React from 'react';
import { Img } from '../../../components/Img';
import { UiOption } from './ui-options';
import { Widget, WidgetProps } from './widget-util';
import { JsonTypes } from '../types';

const ImgWidget: Widget = ({
	value,
	schema,
	uiSchema,
	...props
}: WidgetProps) => {
	return <Img {...props} src={value.toString()} />;
};

ImgWidget.uiOptions = {
	alt: UiOption.string,
	height: UiOption.space,
	width: UiOption.space,
	crossorigin: {
		...UiOption.string,
		enum: ['anonymous', 'use-credentials'],
	},
	decoding: {
		...UiOption.string,
		enum: ['sync', 'async', 'auto'],
	},
	loading: {
		...UiOption.string,
		enum: ['eager', 'lazy'],
	},
	sizes: UiOption.string,
	srcset: UiOption.string,
};

ImgWidget.displayName = 'Img';

ImgWidget.supportedTypes = [JsonTypes.string];

export default ImgWidget;
