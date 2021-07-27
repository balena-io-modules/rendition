import * as React from 'react';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import map from 'lodash/map';
import { ButtonGroup } from '../../ButtonGroup';
import { widgetFactory, getArrayItems, withOptionProps } from './widget-util';
import { JsonTypes } from '../types';
import ButtonWidget from './ButtonWidget';

const validItemTypes = ['string', 'integer', 'number'];

const WrappedButtonWidget = ButtonWidget.uiOptions
	? withOptionProps(ButtonWidget.uiOptions)(ButtonWidget)
	: ButtonWidget;

const ButtonGroupWidget = widgetFactory('ButtonGroup', {}, [JsonTypes.array])(
	({ value, schema, uiSchema, extraContext, extraFormats, ...props }) => {
		if (!isArray(value)) {
			throw new Error(
				`ButtonGroupWidget cannot be used to render a value of type '${typeof value}'`,
			);
		}
		const itemType = get(schema, ['items', 'type'], 'undefined');
		if (!validItemTypes.includes(itemType)) {
			throw new Error(
				`ButtonGroupWidget cannot be used to render an array of items of type ${itemType}`,
			);
		}
		const items = getArrayItems({ value, schema, uiSchema, extraContext });
		return (
			<ButtonGroup {...props}>
				{map(items, (item, index) => (
					<WrappedButtonWidget
						key={index}
						{...item}
						extraFormats={extraFormats}
					/>
				))}
			</ButtonGroup>
		);
	},
);

export default ButtonGroupWidget;
