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
import {
	getSchemaFormat,
	getSubSchemaFromRefScheme,
} from '../../components/Filters/SchemaSieve';

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
	const subSchema = getSubSchemaFromRefScheme(schema);
	const types = subSchema?.type != null ? castArray(subSchema.type) : [];

	if (processedValue == null && !types.includes(JsonTypes.null)) {
		return null;
	}

	const Widget = getWidget(processedValue, format, undefined, extraFormats);

	return (
		<Widget
			extraContext={extraContext}
			extraFormats={extraFormats}
			value={processedValue ?? null}
			schema={schema}
		/>
	);
};
