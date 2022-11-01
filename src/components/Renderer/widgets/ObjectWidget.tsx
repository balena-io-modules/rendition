import * as React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import {
	widgetFactory,
	WidgetProps,
	getObjectPropertyNames,
} from './widget-util';
import { JsonTypes } from '../types';
import { Renderer } from '../index';

const ObjectWidget = widgetFactory('Object', undefined, [JsonTypes.object])(
	({ value, schema, uiSchema, ...rest }) => {
		const propertyNames = getObjectPropertyNames({ value, schema, uiSchema });
		return (
			<React.Fragment>
				{map(propertyNames, (key: string) => {
					const subProps: WidgetProps = {
						value: get(value, key) ?? null,
						schema: get(schema, ['properties', key]),
						uiSchema: get(uiSchema, key),
					};
					return (
						<Renderer key={key} nested valueKey={key} {...subProps} {...rest} />
					);
				})}
			</React.Fragment>
		);
	},
);

export default ObjectWidget;
