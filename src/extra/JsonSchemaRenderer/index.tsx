import * as React from 'react';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import jsone from 'json-e';
import ajv from 'ajv';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../../common-types';
import { Flex } from '../../components/Flex';
import Alert from '../../components/Alert';
import ErrorBoundary from '../../internal/ErrorBoundary';
import widgets, { WidgetWrapperUiOptions, WidgetMeta } from './widgets';
import { Value, JSONSchema, UiSchema, Format } from './types';

export const getValue = (value?: Value, uiSchema?: UiSchema) => {
	return get(uiSchema, 'ui:value', value);
};

const widgetWrapperUiOptionKeys = keys(WidgetWrapperUiOptions);

export const getType = (value?: Value) => {
	if (value === undefined) {
		return 'default';
	}
	if (value === null) {
		return 'null';
	}
	return isArray(value) ? 'array' : typeof value;
};

export const getWidget = (
	value?: Value,
	uiSchemaWidget?: UiSchema['ui:widget'],
) => {
	if (uiSchemaWidget && typeof uiSchemaWidget !== 'string') {
		return uiSchemaWidget;
	}
	const typeWidgets = get(widgets, getType(value), widgets.default);
	return get(typeWidgets, uiSchemaWidget || 'default', widgets.default.default);
};

type Validation = {
	validator: ajv.Ajv;
	validate: ajv.ValidateFunction;
};

const buildValidation = (
	schema?: JSONSchema,
	extraFormats?: Format[],
): Validation => {
	const validator = new ajv();
	forEach(extraFormats, ({ name, format }) => {
		validator.addFormat(name, format);
	});
	return {
		validator,
		validate: validator.compile(schema || {}),
	};
};

export const JsonSchemaRenderer = ({
	value,
	schema,
	uiSchema,
	extraFormats,
	validate,
	nested,
	...props
}: ThemedJsonSchemaRendererProps) => {
	const [validation, setValidation] = React.useState<Validation>(
		buildValidation(schema, extraFormats),
	);
	const [validationErrors, setValidationErrors] = React.useState<
		ajv.ErrorObject[] | null | undefined
	>(null);

	React.useEffect(() => {
		if (!validate || nested) {
			return;
		}
		setValidation(buildValidation(schema, extraFormats));
	}, [validate, nested, extraFormats, schema]);

	React.useEffect(() => {
		if (!validate || nested) {
			return;
		}
		validation.validate(value);
		setValidationErrors(validation.validate.errors);
	}, [validate, nested, validation, value]);

	// Setting the UI Schema explicitly to null (as opposed to it being
	// undefined) indicates you don't want to render anything.
	if (uiSchema === null) {
		return null;
	}

	const processedUiSchema = jsone(uiSchema || {}, { source: value });
	const processedValue = getValue(value, processedUiSchema);

	if (processedValue === undefined || processedValue === null) {
		return null;
	}

	const wrapperProps = pick(
		get(processedUiSchema, 'ui:options', {}),
		...widgetWrapperUiOptionKeys,
	);
	const Widget = getWidget(processedValue, processedUiSchema['ui:widget']);

	return (
		<Flex
			minWidth={0}
			minHeight={0}
			alignItems="flex-start"
			mb={1}
			flexDirection="column"
			{...props}
			{...wrapperProps}
		>
			{validationErrors && (
				<Alert
					my={2}
					plaintext
					danger
					tooltip={validation.validator.errorsText(validationErrors)}
				>
					Invalid data/schema
				</Alert>
			)}
			<WidgetMeta schema={schema} uiSchema={processedUiSchema} />
			<Widget
				value={processedValue}
				schema={schema}
				uiSchema={processedUiSchema}
			/>
		</Flex>
	);
};

interface ThemedJsonSchemaRendererProps
	extends InternalJsonSchemaRendererProps {
	theme: Theme;
}

interface InternalJsonSchemaRendererProps extends DefaultProps {
	nested?: boolean;
	validate?: boolean;
	value?: Value;
	schema: JSONSchema;
	uiSchema?: UiSchema;
	extraFormats?: Format[];
}

export type JsonSchemaRendererProps = InternalJsonSchemaRendererProps &
	RenditionSystemProps;

export const RenditionJsonSchemaRenderer = asRendition<
	React.FunctionComponent<JsonSchemaRendererProps>
>(JsonSchemaRenderer);

export default function (props: JsonSchemaRendererProps) {
	return (
		<ErrorBoundary>
			<RenditionJsonSchemaRenderer {...props} />
		</ErrorBoundary>
	);
}
