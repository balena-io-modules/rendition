import React from 'react';
import {
	Format,
	JsonTypes,
	UiSchema,
	Value,
} from '../../components/Renderer/types';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { transformUiSchema } from '../../components/Renderer/widgets/widget-util';
import { getValue, getWidget } from '../../components/Renderer';
import castArray from 'lodash/castArray';
import { getSchemaFormat } from './models/helpers';

interface CustomWidgetProps {
	value: Value;
	extraContext: object | undefined;
	schema: JSONSchema;
	extraFormats: Format[];
	uiSchema?: UiSchema;
}

export const CustomWidget = ({
	value,
	extraContext,
	schema,
	extraFormats,
	uiSchema,
}: CustomWidgetProps) => {
	const format = getSchemaFormat(schema);

	if (!format) {
		return <>{value}</>;
	}
	const processedUiSchema = transformUiSchema({
		value,
		uiSchema,
		extraContext,
	});

	const processedValue = getValue(value, schema, processedUiSchema);
	const types = schema?.type != null ? castArray(schema.type) : [];

	if (
		processedValue === undefined ||
		(processedValue === null && !types.includes(JsonTypes.null))
	) {
		return null;
	}

	const Widget = getWidget(processedValue, format, undefined, extraFormats);

	return (
		<Widget
			extraContext={extraContext}
			extraFormats={extraFormats}
			value={processedValue}
			schema={schema}
		/>
	);
};
