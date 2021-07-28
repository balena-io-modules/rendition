import * as React from 'react';
import { Img } from '../../Img';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { JsonTypes } from '../types';

const ImgWidget = widgetFactory(
	'Img',
	{
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
	},
	[JsonTypes.string],
)(({ value, schema, uiSchema, ...props }) => {
	if (value == null) {
		return null;
	}
	return <Img {...props} src={value.toString()} />;
});

export default ImgWidget;
