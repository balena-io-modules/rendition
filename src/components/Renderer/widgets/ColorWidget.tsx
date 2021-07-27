/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import React from 'react';
import { Flex } from '../../Flex';
import { Txt } from '../../Txt';
import { JsonTypes } from '../types';
import { UiOption } from './ui-options';
import { widgetFactory } from './widget-util';
import { isLight } from '../../../utils/colorUtils';

const DEFAULT_WIDTH = '100px';
const DEFAULT_HEIGHT = '100px';

interface ExtraColorWidgetProps {
	label?: string;
	hideValueDisplay?: boolean;
	width?: string | number;
	height?: string | number;
}

const ColorWidget = widgetFactory(
	'Color',
	{
		label: UiOption.string,
		hideValueDisplay: UiOption.bool,
		width: UiOption.space,
		height: UiOption.space,
	},
	[JsonTypes.string],
)<object, ExtraColorWidgetProps>(
	({
		value,
		schema,
		uiSchema,
		label,
		hideValueDisplay,
		width = DEFAULT_WIDTH,
		height = DEFAULT_HEIGHT,
		...props
	}) => {
		if (value == null) {
			return null;
		}

		const bg = value.toString() || 'transparent';
		const color = isLight(bg) ? '#000' : '#FFF';
		return (
			<Flex
				{...props}
				width={width}
				height={height}
				bg={bg}
				color={color}
				alignItems="center"
				flexDirection="column"
				justifyContent="center"
			>
				{label && <Txt>{label}</Txt>}
				{!hideValueDisplay && <Txt>{value}</Txt>}
			</Flex>
		);
	},
);

export default ColorWidget;
