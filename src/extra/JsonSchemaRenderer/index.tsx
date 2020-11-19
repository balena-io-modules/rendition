import * as React from 'react';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import ajv from 'ajv';
import asRendition from '../../asRendition';
import { RenditionSystemProps, Theme } from '../../common-types';
import { Flex } from '../../components/Flex';
import { Alert } from '../../components/Alert';
import ErrorBoundary from '../../internal/ErrorBoundary';
import widgets, {
	WidgetWrapperUiOptions,
	WidgetMeta,
	formatWidgetMap,
} from './widgets';
import { transformUiSchema } from './widgets/widget-util';
import { Value, JSONSchema, UiSchema, Format } from './types';

export const getValue = (
	value?: Value,
	schema?: JSONSchema,
	uiSchema?: UiSchema,
) => {
	const calculatedValue = get(uiSchema, 'ui:value', value);
	// Fall back to schema's default value if value is undefined
	return calculatedValue !== undefined
		? calculatedValue
		: get(schema, 'default');
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
	format?: string,
	uiSchemaWidget?: UiSchema['ui:widget'],
	extraFormats?: Format[],
) => {
	if (uiSchemaWidget && typeof uiSchemaWidget !== 'string') {
		return uiSchemaWidget;
	}

	const extraFormat = extraFormats?.find(
		(extraFormat) => extraFormat.name === format,
	);
	if (!uiSchemaWidget && extraFormat?.widget) {
		return extraFormat.widget;
	}

	if (!uiSchemaWidget && format && formatWidgetMap[format]) {
		return formatWidgetMap[format];
	}
	const typeWidgets = get(widgets, getType(value), widgets.default);
	return get(typeWidgets, uiSchemaWidget || 'default', typeWidgets.default);
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
	valueKey,
	extraFormats,
	extraContext,
	validate,
	nested,
	...props
}: ThemedJsonSchemaRendererProps) => {
	const [validation, setValidation] = React.useState<Validation | null>(
		validate && !nested ? buildValidation(schema, extraFormats) : null,
	);
	const [validationErrors, setValidationErrors] = React.useState<
		ajv.ErrorObject[] | null | undefined
	>(null);

	React.useEffect(() => {
		if (!validate || nested) {
			setValidationErrors(null);
			return;
		}
		setValidation(buildValidation(schema, extraFormats));
	}, [validate, nested, extraFormats, schema]);

	React.useEffect(() => {
		if (!validate || nested) {
			return;
		}
		let v = validation;
		if (!v) {
			v = buildValidation(schema, extraFormats);
			setValidation(v);
		}
		v.validate(value);
		setValidationErrors(v.validate.errors);
	}, [validate, nested, validation, value]);

	// Setting the UI Schema explicitly to null (as opposed to it being
	// undefined) indicates you don't want to render anything.
	if (uiSchema === null) {
		return null;
	}

	const processedUiSchema = transformUiSchema({
		value,
		uiSchema,
		extraContext,
	});
	const processedValue = getValue(value, schema, processedUiSchema);

	if (processedValue === undefined || processedValue === null) {
		return null;
	}

	const wrapperProps = pick(
		get(processedUiSchema, 'ui:options', {}),
		...widgetWrapperUiOptionKeys,
	);
	const Widget = getWidget(
		processedValue,
		get(schema, 'format'),
		processedUiSchema['ui:widget'],
		extraFormats,
	);

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
					tooltip={validation?.validator.errorsText(validationErrors)}
				>
					Invalid data/schema
				</Alert>
			)}
			<WidgetMeta
				schema={schema}
				uiSchema={processedUiSchema}
				valueKey={valueKey}
			/>
			<Widget
				extraContext={extraContext}
				extraFormats={extraFormats}
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

interface InternalJsonSchemaRendererProps
	extends React.HTMLAttributes<HTMLElement> {
	nested?: boolean;
	/** If set, the `value` will be validated against the `schema` and any error will be displayed at the top of the rendered output. Useful for debugging. */
	validate?: boolean;
	valueKey?: string;
	/** The data that should be rendere */
	value?: Value;
	/** A json schema describing the shape of the data you would like to render */
	schema: JSONSchema;
	/** A configuration object used to change the styling and layout of the rendered data. */
	uiSchema?: UiSchema;
	/** An optional array of formats to pass to the validator, and an optional custom widget for the format. See [addFormat](https://github.com/ajv-validator/ajv#api-addformat) for details of formatters. */
	extraFormats?: Format[];
	/** Extra context used by `json-e` when transforming the UI schema. */
	extraContext?: object;
}

export type JsonSchemaRendererProps = InternalJsonSchemaRendererProps &
	RenditionSystemProps;

export const RenditionJsonSchemaRenderer = asRendition<
	React.FunctionComponent<JsonSchemaRendererProps>
>(JsonSchemaRenderer);

/**
 * A component used to render JSON data based on a schema and a UI schema.
 *
 * >To understand the interaction between the `value`, `schema` and `uiSchema` props (as well as the use of `extraFormats` and `extraContext`) it's worth looking through the examples in [examples.ts](./examples.ts) and having a play with the [JsonSchemaRenderer Playground](https://balena-io-modules.github.io/rendition/?path=/story/extra-jsonschemarenderer--playground) in the Rendition Storybook site.
 *
 * ## UI Schema fields
 *
 * The UI schema for any value may consist of any of the following fields:
 *
 * | Field | Description |
 * |-------|-------------|
 * | `ui:title` | The title of the data field.<br><br>If not set, the value of `schema.title` is used. If `schema.title` is not set, the value's key is used, in 'Start Case'.<br><br>Set `'ui:title': null` to hide the title. |
 * | `ui:description` | The description of the data field.<br><br>If not set, the value of `schema.description` is used.<br><br>Set `'ui:description': null` to hide the description. |
 * | `ui:widget` | Specifies the widget to use to render the data |
 * | `ui:order` | For values of type `object`, this field can be used to specify the order in which to render the object's properties.<br><br>e.g. `'ui:order': [ 'propB', 'propA' ]` |
 * | `ui:value` | Can be used to override/transform the data value. Particularly useful when used with [json-e](https://json-e.js.org/) transforms.<br><br>e.g. `'ui:value': 'Hello ${source}'` |
 * | `ui:options` | An object that can be provided to define additional UI options specific to the widget used to render the data value. For more details see the [Widgets README](./widgets/README.md#ui-options). |
 * | `items` | If the value is an array, use the `items` field to specify the UI schema of all items in the array. This is where `json-e` is particularly useful when combined with `${source}` to get the value of the item. |
 *
 * Note that all fields in the UI schema can be expressed using [json-e](https://json-e.js.org/) syntax.
 *
 * ### Transforming nested UI schemas
 *
 * Each 'level' of a nested UI schema is transformed independently using json-e.
 *
 * Consider the following example:
 *
 * ```javascript
 * const value = {
 *   links: [ 'link1', 'link2' ]
 * }
 *
 * const uiSchema = {
 *   links: {
 *     'ui:widget': 'Link',
 *     items: {
 *       'ui:options': {
 *         href: 'https://mysite.com/${source}'
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * In this example a json-e transform is run for each item in the `links` array, allowing a unique value of `ui:options.href` to be set for each link in the array.
 *
 * # JsonSchemaRenderer Widgets
 *
 * A [`JsonSchemaRenderer`](../README.md) widget is responsible for rendering an individual data value.
 *
 * ## Overview
 *
 * A number of `JsonSchemaRenderer` widgets are provided by Rendition.
 *
 * * These widgets can be referenced by their string widget name
 * * Each widget is a simple wrapper around an underlying Rendition component
 * * Each widget defines which data types it supports
 *
 * | Widget Name       | Underlying component | Supported value types**  | UI Options |
 * |-------------------|-------------------------|--------------------------|:----------:|
 * | `Array`           | [JsonSchemaRenderer](../README.md)[]* | `array` | [ref](#array) |
 * | `Badge`           | [Badge](../../../components/Badge/README.md)| `string | integer | number | boolean` | [ref](#badge) |
 * | `ButtonGroup`     | [ButtonGroup](../../../components/ButtonGroup/README.md)|  `array` | [ref](#buttongroup) |
 * | `Button`          | [Button](../../../components/Button/README.md) | `string | integer | number | boolean` | [ref](#button) |
 * | `Checkbox`        | [Checkbox](../../../components/Checkbox/README.md) | `boolean` | [ref](#checkbox) |
 * | `DropDownButton`  | [DropDownButton](../../../components/DropDownButton/README.md) | `array` | [ref](#dropdownbutton) |
 * | `Heading`         | [Heading](../../../components/Heading/README.md) | `string` | [ref](#heading) |
 * | `HighlightedName` | [HighlightedName](../../../components/HighlightedName/README.md) | `string | integer | number | boolean` | [ref](#highlightedname) |
 * | `Img`             | [Img](../../../components/Img/README.md) | `string` | [ref](#img) |
 * | `Link`            | [Link](../../../components/Link/README.md) | `string` | [ref](#link) |
 * | `List`            | [List](../../../components/List/README.md) | `array` | [ref](#list) |
 * | `Markdown`        | [Markdown](../../Markdown/README.md) | `string` | [ref](#markdown) |
 * | `Mermaid`         | [Mermaid](../../Mermaid/README.md) | `string` | [ref](#mermaid) |
 * | `Object`          | [JsonSchemaRenderer](../README.md)* | `object` | [ref](#object) |
 * | `Tag`             | [Tag](../../../components/Tag/README.md) | `string | integer | number` | [ref](#tag) |
 * | `Txt`             | [Txt](../../../components/Txt/README.md) | `string | integer | number | boolean` | [ref](#txt) |
 *
 * \* _Recursive_ - when the value is iterable (e.g. the properties of an object or the items in an array) these widgets pass each iterated value to a `JsonSchemaRenderer` instance in a recursive manner.
 *
 * \*\* Remember: as the rendered value can be set using the `ui:value` field of the UI schema (potentially using a [json-e](https://json-e.js.org/) transformation), the resolved data type does not necessarily correspond to the data type of the `value` prop.
 *
 * ### Example usage
 *
 * A great way to see the interaction between a UI schema and these widgets is to look through the examples in [examples.ts](../examples.ts)
 *
 * ### JsonSchemaRenderer Playground
 *
 * To test out the various built-in widgets you can use the [JsonSchemaRenderer Playground](https://balena-io-modules.github.io/rendition/?path=/story/extra-jsonschemarenderer--playground) in the Rendition Storybook site.
 *
 * ## Specifying a Widget
 *
 * ### Built-in Widgets
 *
 * To specify the Rendition widget to use to render a particular data value, set the `ui:widget` value within the UI schema to the `displayName` of the widget. For example:
 *
 * ```javascript
 * {
 *   value: true,
 *   uiSchema: {
 *     'ui:widget': 'Checkbox'
 *   }
 * }
 * ```
 *
 * ### Custom Widgets
 *
 * If you want to provide your own widget, just set the `ui:widget` value to the widget component to use:
 *
 * ```javascript
 * const MyWidget = ({ value, schema, ...rest }) => (
 *   <div>{value}</div>
 * )
 *
 * const uiSchema = {
 *   // Important: use the actual component reference, not it's string name
 *   'ui:widget': MyWidget
 * }
 * ```
 *
 * _Note: the props passed to your custom widget will be the [widget props](#widget-props)._
 *
 * ### Widgets Specified by Schema Format
 *
 * If the schema defines a `format` value, this may be used to pick a widget _if no `ui:widget` has been specified_. The following formats are mapped to widgets:
 *
 * | Format     | Widget     |
 * |------------|------------|
 * | `markdown` | `Markdown` |
 * | `mermaid`  | `Mermaid`  |
 * | `email`    | `Link`     |
 * | `uri`      | `Link`     |
 *
 * ### Default Widgets
 *
 * If no `ui:widget` is specified and the widget cannot be determined by the schema's `format` value, the widget used is determined by the default widget for the data type of the value:
 *
 * | Type of value | Widget   |
 * |---------------|----------|
 * | object        | `Object` |
 * | array         | `Array`  |
 * | string        | `Txt`    |
 * | number        | `Txt`    |
 * | boolean       | `Txt`    |
 * | null          | `Txt`    |
 * | undefined     | `Txt`    |
 *
 * _Note: as the rendered value can be set using the `ui:value` field of the UI schema (potentially using a [json-e](https://json-e.js.org/) transformation), the resolved data type does not necessarily correspond to the data type of the `value` prop._
 *
 * ## Widget Props
 *
 * All widgets are passed the same props:
 *
 * | Name           | Type           | Required | Description |
 * |----------------|----------------|----------|-------------|
 * |	`value`        | `DefinedValue` | ✓        | The value to display |
 * |	`schema`       | `JSONSchema`   | ✓        | The schema that described the value |
 * |	`uiSchema`     | `UiSchema`     | -        | The UI schema the defines how the value should be displayed. Note that the UI schema may contain _json-e template syntax_ that will be transformed by [json-e](https://json-e.js.org/) before being used. |
 * |	`extraFormats` | `Format[]`     | -        | An array of extra formats to include when validating the schema. See https://www.npmjs.com/package/ajv#formats for more details. |
 * |	`extraContext` | `object`       | -        | Extra context that is passed to [json-e](https://json-e.js.org/) when transforming the UI schema. This context can even contain functions that can be invoked by json-e when executing the transformation. |
 *
 * ## UI Options
 *
 * In addition to the standard widget props, each Widget component defines additional props that it accepts as 'UI options'.
 *
 * ### Specifying UI Options in the UI Schema
 *
 * UI options are specified in the UI schema using the `ui:options` key:
 *
 * ```javascript
 * {
 *   'ui:widget': 'Txt',
 *   'ui:options': {
 *     bold: true,
 *     italic: true
 *   }
 * }
 * ```
 *
 * ### UI Options common to all Widgets
 *
 * The following UI options may be specified for _any_ widget:
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * | `p`     | `[string | number]`* | padding            |
 * | `pt`    | `[string | number]`* | padding-top        |
 * | `pb`    | `[string | number]`* | padding-bottom     |
 * | `pl`    | `[string | number]`* | padding-left       |
 * | `pr`    | `[string | number]`* | padding-right      |
 * | `px`    | `[string | number]`* | padding-horizontal |
 * | `py`    | `[string | number]`* | padding-vertical   |
 * | `m`     | `[string | number]`* | margin             |
 * | `mt`    | `[string | number]`* | margin-top         |
 * | `mb`    | `[string | number]`* | margin-bottom      |
 * | `ml`    | `[string | number]`* | margin-left        |
 * | `mr`    | `[string | number]`* | margin-right       |
 * | `mx`    | `[string | number]`* | margin-horizontal  |
 * | `my`    | `[string | number]`* | margin-vertical    |
 * | `flex` | `[string | number]`* | flex |
 * | `flexDirection` | `['column' | 'row' | 'column-reverse' | 'row-reverse']`* | flex-direction |
 * | `flexBasis` | `string`* | flex-basis |
 * | `flexWrap` | `['nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit']`* | flex-wrap |
 * | `alignItems` | `['stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit']`* | align-items |
 * | `alignSelf` | `['auto' | 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit']`* | align-self |
 * | `justifyContent` | `['flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'initial' | 'inherit']`* | justify-content |
 * | `justifySelf` | `['auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end' | 'left' | 'right' | 'baseline' | 'initial' | 'inherit' | 'unset']`* | justify-self |
 *
 * \* Can be specified as an array to work with styled-system's [responsive styles](https://styled-system.com/responsive-styles).
 *
 * ### UI Options by Widget
 *
 * The UI options for Rendition JsonSchemaRenderer widgets roughly correspond to the props that can be passed to the underlying Rendition component. If in doubt, consult the appropriate component's README for details of the prop in question.
 *
 * #### **Array**
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * |`orientation` | `['vertical' | 'horizontal']` | The array items are wrapped in a flexbox div. If the `orientation` is `horizontal`, the flex direction of this div will be `row`; otherwise it will be `column`. |
 * | `truncate` | `number` | Set `truncate` to a positive integer to set the max number of items to display. Additional items will be displayed with a summary (e.g. '+ 8 more') |
 *
 * #### **Badge**
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * | `shade` | `number`  | The index (0-22) for one of the pre-determined shades for the badge |
 *
 * #### **ButtonGroup**
 *
 * _There are no additional UI options for `ButtonGroup`._
 *
 * >Note that the `ButtonGroup` widget may only be used for **arrays of strings or numbers**. Each item in the array will be rendered using the `Button` widget and therefore any `ui:options` allowed by the `Button` widget may be specified in the `items['ui:options']` field.
 *
 * #### **Button**
 *
 * | Option        | Type      | Description           |
 * |---------------|-----------|-----------------------|
 * | `href`        | `string`  | The URL to navigate to when the button is clicked |
 * | `target`      | `['_blank' | '_self' | '_parent' | '_top']` | Corresponds to the `target` attribute of an `a` link element |
 * | `disabled`    | `boolean` | Set to true to disable the button |
 * | `primary`     | `boolean` | If true, use the `primary` theme color |
 * | `secondary`   | `boolean` | If true, use the `secondary` theme color |
 * | `tertiary`    | `boolean` | If true, use the `tertiary` theme color |
 * | `quarternary` | `boolean` | If true, use the `quarternary` theme color |
 * | `danger`      | `boolean` | If true, use the `danger` theme color |
 * | `warning`     | `boolean` | If true, use the `warning` theme color |
 * | `success`     | `boolean` | If true, use the `success` theme color |
 * | `info`        | `boolean` | If true, use the `info` theme color |
 * | `light`       | `boolean` | If true, use white background and default text color |
 * | `outline`     | `boolean` | If true, the button will have a transparent background, and the border and text color will match |
 * | `plain`       | `boolean` | If true, render the button without padding, background or border |
 * | `underline`   | `boolean` | Similar to the `plaintext` prop, but displays a line underneath the button text |
 *
 * #### **Checkbox**
 *
 * | Option    | Type      | Description           |
 * |-----------|-----------|-----------------------|
 * | `label`   | `string`  | The checkbox label (defaults to the value itself) |
 * | `reverse` | `boolean` | If true, place the label before the checkbox |
 * | `toggle`  | `boolean` | If true, render the checkbox as a toggle |
 *
 * #### **DropDownButton**
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * | `primary`     | `boolean` |If true, use the `primary` theme color |
 * | `secondary`   | `boolean` | If true, use the `secondary` theme color |
 * | `tertiary`    | `boolean` | If true, use the `tertiary` theme color |
 * | `quarternary` | `boolean` | If true, use the `quarternary` theme color |
 * | `danger`      | `boolean` | If true, use the `danger` theme color |
 * | `warning`     | `boolean` | If true, use the `warning` theme color |
 * | `success`     | `boolean` | If true, use the `success` theme color |
 * | `info`        | `boolean` | If true, use the `info` theme color |
 * | `emphasized`  | `boolean` | If true, use a larger size |
 * | `square`      | `boolean` | If true, render the button with equal length width and height |
 * | `disabled`    | `boolean` | If true, disabled the button |
 * | `label`       | `string` | The text that will be displayed inside the main button |
 * | `border`      | `boolean` | If true, place a border between each item in the dropdown |
 * | `joined`      | `boolean` | If true, render the component as a single button instead of two |
 * | `alignRight`  | `boolean` | If true, put the dropdown list on the right  |
 * | `listMaxHeight` | `[string | number]` | If setted, it defines the maximum height of the dropdown list |
 *
 * #### **Heading**
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * | `size`  | `number`          | The heading size (1-6) - corresponds to `h1`, `h2` etc |
 *
 * #### **HighlightedName**
 *
 * | Option  | Type              | Description           |
 * |---------|-------------------|-----------------------|
 * | `bg` | `string` | The background color (if not set, the background color will be automatically generated from the value itself) |
 * | `color` | `string` | The foreground color (if not set, the color will be automatically set as black or white based on whether the background color is light or dark) |
 *
 * #### **Img**
 *
 * | Option        | Type              | Description           |
 * |---------------|-------------------|-----------------------|
 * | `alt`         | `string` | The `alt` attribute passed to the `img` element |
 * | `height`      | `[string | number]`* | The height of the image |
 * | `width`       | `[string | number]`* | The width of the image |
 * | `crossorigin` | `['anonymous' | 'use-credentials']` | The `crossorigin` attribute passed to the `img` element |
 * | `decoding`    | `['sync' | 'async' | 'auto']` | The `decoding` attribute passed to the `img` element |
 * | `loading`     | `['eager' 'lazy']` | The `loading` attribute passed to the `img` element |
 * | `sizes`       | `string` | The `sizes` attribute passed to the `img` element |
 * | `srcset`      | `string` | The `srcset` attribute passed to the `img` element |
 *
 * #### **Link**
 *
 * | Option     | Type      | Description           |
 * |------------|-----------|-----------------------|
 * | `href`     | `string`  | The URL to link to |
 * | `blank`    | `boolean` | If true, will open the link in a new tab |
 * | `download` | `string`  | The `download` attribute passed to the `a` element |
 * | `rel`      | `string`  | The `rel` attribute passed to the `a` element |
 * | `type`     | `string`  | The `type` attribute passed to the `a` element |
 *
 * #### **List**
 *
 * | Option     | Type      | Description           |
 * |------------|-----------|-----------------------|
 * | `ordered` | `boolean` | If true, `ol` will be used rather than `ul` |
 * | `truncate` | `integer` | Optionally set the number of items to display in the list. Additional items will be displayed with a summary (e.g. '+ 8 more') |
 *
 * #### **Markdown**
 *
 * _There are no additional UI options for `Markdown`._
 *
 * #### **Mermaid**
 *
 * _There are no additional UI options for `Mermaid`._
 *
 * #### **Object**
 *
 * _There are no additional UI options for `Object`._
 *
 * #### **Tag**
 *
 * | Option     | Type      | Description           |
 * |------------|-----------|-----------------------|
 * | `operator` | `string`  | The operator that goes between the name and value of the tag  |
 * | `name`     | `string`  | The name part of the tag. If not provided only the value will be shown  |
 *
 * #### **Txt**
 *
 * | Option     | Type      | Description           |
 * |------------|-----------|-----------------------|
 * | `dtFormat` | `string`  | The date-time format used to display a date/time string. _Note: this uses the [date-fns format syntax](https://date-fns.org/v2.16.1/docs/format)._ |
 * | `bold`     | `boolean` | If true, text will be **bold** |
 * | `italic`   | `boolean` | If true, text will be _italic__ |
 * | `monospace`| `boolean` | If true, text will be `monospace` |
 * | `caps`     | `boolean` | If true, text will be in CAPITALS |
 * | `align`    | `['left' | 'right' | 'center' | 'justify' | 'justify-all' | 'start' | 'end' | 'match-parent' | 'inherit' | 'initial' | 'unset']` | Text alignment |
 * | `whitespace` | `['normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'initial' | 'inherit']` | Specifies how whitespace is handled |
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/JsonSchemaRenderer/JsonSchemaRenderer.stories.tsx)
 */
export default function (props: JsonSchemaRendererProps) {
	return (
		<ErrorBoundary>
			<RenditionJsonSchemaRenderer {...props} />
		</ErrorBoundary>
	);
}
