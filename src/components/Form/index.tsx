import type { JSONSchema7 as JSONSchema } from 'json-schema';
import uniqBy from 'lodash/uniqBy';
import * as React from 'react';
import RsjfForm, {
	IChangeEvent,
	FormProps as JsonSchemaFormProps,
	UiSchema,
	WidgetProps,
	Field,
	Widget,
} from '@rjsf/core';
import styled from 'styled-components';
import { Box, BoxProps } from '../Box';
import { Button, ButtonProps } from '../Button';
import * as utils from '../../utils';
import { DescriptionField } from './fields/DescriptionField';
import ObjectField from './fields/ObjectField';
import { TitleField } from './fields/TitleField';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import FieldTemplate from './templates/FieldTemplate';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate';
import BaseInput from './widgets/BaseInput';
import PasswordWidget from './widgets/PasswordWidget';
import SelectWidget from './widgets/SelectWidget';
import TextareaWidget from './widgets/TextareaWidget';
import { Format } from '../Renderer/types';
import { WidgetContext } from '../../contexts/WidgetContext';

const SUPPORTED_SCHEMA_FORMATS = [
	'data-url',
	'date',
	'date-time',
	'email',
	'hostname',
	'ipv4',
	'ipv6',
	'uri',
];

let internalWidgets: {
	[k: string]: any;
} = {
	BaseInput,
	SelectWidget,
	PasswordWidget,
	TextareaWidget,
};

const fields: {
	[k: string]: any;
} = {
	DescriptionField,
	ObjectField,
	TitleField,
};

const FormWrapper = styled(Box)`
	section {
		margin: 0;
		padding: 0;
		border: 0;
	}

	label {
		font-size: ${(props) => utils.px(props?.theme?.fontSizes[1])};
	}

	input {
		font-size: ${(props) => utils.px(props?.theme?.fontSizes[2])};
	}

	/* Style the error list, since it can't be templated */
	.panel-danger,
	.error-detail {
		font-size: ${(props) => utils.px(props?.theme?.fontSizes?.[1] ?? 14)};
		margin-top: ${(props) => utils.px(props?.theme?.space?.[1] ?? 4)};
		margin-bottom: ${(props) => utils.px(props?.theme?.space?.[1] ?? 4)};
		list-style-type: none;
		padding-left: 0;
	}

	.text-danger {
		color: ${(props) => props?.theme?.colors?.danger?.main ?? '#a94442'};
	}

	input[type='file'] {
		cursor: pointer;
		&::file-selector-button {
			cursor: pointer;
			font-weight: ${(props) => props.theme.button.font.weight};
			font-size: ${(props) => props.theme.button.font.size};
			height: ${(props) => props.theme.button.height};
			border-color: ${(props) => props.theme.colors.primary.main};
			background: ${(props) => props.theme.colors.primary.main};
			white-space: nowrap;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: white;
			padding: 4px 20px;
			border-radius: 20px;
			border: 1px solid ${(props) => props.theme.colors.primary.main};

			&:disabled {
				cursor: not-allowed;
			}
			&:hover {
				box-shadow: none;
				background: ${(props) => props.theme.colors.primary.dark};
				border-color: ${(props) => props.theme.colors.primary.dark};
			}
		}
	}
`;

const parseSchema = (schema: JSONSchema) => {
	const whitelist = SUPPORTED_SCHEMA_FORMATS.concat(
		Object.keys(internalWidgets),
	);
	return utils.stripSchemaFormats(schema, whitelist);
};

export interface RenditionUiSchema extends UiSchema {
	'ui:warning'?: string;
}

/**
 * Properties passed to custom Form widgets
 *
 * @see https://github.com/mozilla-services/react-jsonschema-form#custom-widget-components
 */
export interface FormWidgetProps extends WidgetProps {
	registry: {
		fields: { [name: string]: Field };
		widgets: { [name: string]: Widget };
		definitions: { [name: string]: any };
		formContext: any;
	};
	type?: string;
	rawErrors: string[];
}

export interface FormProps
	extends BoxProps,
		Pick<
			JsonSchemaFormProps<any>,
			| 'validate'
			| 'noValidate'
			| 'liveValidate'
			| 'transformErrors'
			| 'disabled'
		> {
	/** A string or JSX element to replace the text in the form submit button */
	submitButtonText?: string | JSX.Element;
	/** If true, do not display the form submit button */
	hideSubmitButton?: boolean;
	/** Properties that are passed to the submit button, these are the same props used for the [`Button`](#button) component */
	submitButtonProps?: ButtonProps;
	/** If passed, it will show a secondary button, these are the same props used for the [`Button`](#button) component */
	secondaryButtonProps?: ButtonProps;
	/** The data that should be displayed in the form */
	value?: number | string | boolean | { [index: string]: any } | any[] | null;
	/** A function that is called when form data changes */
	onFormChange?: (result: IChangeEvent) => void;
	/** A function that is called when the form is submitted */
	onFormSubmit?: (result: any) => void;
	/** A configuration object used to change the styling and layout of the form. See the [`react-jsonschema-form`](https://github.com/mozilla-services/react-jsonschema-form) docs for more details */
	uiSchema?: RenditionUiSchema;
	/** A json schema describing the shape of the data you would like to gather */
	schema: JSONSchema;
	/** A list of extra formats the form should support and be able to render */
	extraFormats?: Format[];
	/** Extra form widgets */
	widgets?: {
		[k: string]: any;
	};
}

const BaseForm = React.forwardRef<RsjfForm<any>, FormProps>(
	(
		{
			schema,
			value,
			disabled,
			extraFormats,
			onFormChange,
			onFormSubmit,
			hideSubmitButton,
			submitButtonText,
			submitButtonProps,
			secondaryButtonProps,
			uiSchema,
			validate,
			liveValidate,
			noValidate,
			transformErrors,
			widgets,
			...props
		}: FormProps,
		ref,
	) => {
		const { form } = React.useContext(WidgetContext);
		const contextFormats = form?.formats ?? [];
		const allWidgets = React.useMemo(() => {
			return {
				...internalWidgets,
				...uniqBy(
					[...(extraFormats ?? []), ...contextFormats],
					(format) => format.name,
				).reduce((agg: { [k: string]: any }, format) => {
					if (format.widget) {
						agg[format.name] = format.widget;
					}
					return agg;
				}, {}),
				...widgets,
			};
		}, [internalWidgets, extraFormats]);

		// TODO: This is required for the extra widgets to be rendered, not sure why yet.. :/
		internalWidgets = allWidgets;

		const calculatedSchema = React.useMemo(() => {
			const parsedSchema = parseSchema(schema);
			// Some keywords cause errors in RJSF validation, so they are removed from the
			// schema before being passed as a prop.
			const { $schema, ...resultingSchema } =
				utils.disallowAdditionalProperties(parsedSchema);
			return resultingSchema;
		}, [schema]);
		const [formState, setFormState] = React.useState(value);

		React.useEffect(() => {
			setFormState(value);
		}, [value]);

		const handleKeyUpDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === 'Enter' && !hideSubmitButton) {
					e.stopPropagation();
				}
			},
			[hideSubmitButton],
		);

		const change = React.useCallback(
			(data: IChangeEvent) => {
				setFormState(data.formData);

				if (onFormChange) {
					onFormChange(data);
				}
			},
			[onFormChange],
		);

		return (
			<FormWrapper
				{...props}
				onKeyDown={handleKeyUpDown}
				onKeyUp={handleKeyUpDown}
			>
				<RsjfForm
					ref={ref}
					disabled={disabled}
					liveValidate={liveValidate}
					noValidate={noValidate}
					validate={validate}
					transformErrors={transformErrors}
					showErrorList={false}
					schema={calculatedSchema}
					formData={formState}
					onSubmit={onFormSubmit}
					onChange={change}
					uiSchema={uiSchema}
					widgets={allWidgets}
					fields={fields}
					FieldTemplate={FieldTemplate}
					ObjectFieldTemplate={ObjectFieldTemplate}
					ArrayFieldTemplate={ArrayFieldTemplate}
				>
					{hideSubmitButton && <span />}

					{!hideSubmitButton && (
						<Button primary {...submitButtonProps} type="submit">
							{submitButtonText || 'Submit'}
						</Button>
					)}
					{!!secondaryButtonProps && (
						<Button outline secondary ml={3} {...secondaryButtonProps} />
					)}
				</RsjfForm>
			</FormWrapper>
		);
	},
);

/**
 * A component that can be used for generating a form from a [json schema](http://json-schema.org/) object.
 * The standard json schema types are supported, as well as the `date-time` format.
 *
 * Under the hood, this component uses [`react-jsonschema-form`](https://github.com/mozilla-services/react-jsonschema-form) and support
 * all [`uiSchema`](https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object) options from that project.
 *
 * Additional formats are supported, but require supporting widgets to be loaded.
 * For example if you would like to support the [mermaid](https://mermaidjs.github.io/) format, you'll need to
 * import the widget using `import 'renditon/dist/extra/Form/mermaid'`.
 *
 * This import only needs to happen once, so it is recommended that its done at the
 * root level of your application.
 *
 * ## Custom uiSchema properties
 *
 * Some templates and widgets support additional uiSchema options, defined using `ui:options` object in the `uiSchema` definition. Those are:
 *
 * ### PasswordWidget
 *
 * | Name          | Type      | Default   | Required   | Description                                          |
 * | ------ | ------ | --------- | ---------- | ------------- |
 * | `showPasswordStrengthMeter`    | `boolean` | false | - | A boolean denoting whether a password strenth meter will be shown. `zxcvbn` should be loaded beforehand and set to the window object as `window.zxcvbn` |
 *
 * ### ObjectField
 *
 * | Name          | Type      | Default   | Required   | Description                                          |
 * | ------ | ------ | --------- | ---------- | ------------- |
 * | `responsive`    | `boolean` | false | - | A boolean denoting whether the object fields should be wrapped in a row-directed flex container and wrap once their size is larger than the minimum|
 * | `flex`    | `Array<number | string>` | - | - | Works together with `responsive`. It passes the `flex` value to the same-indexed field in the object. This allows you to have more control over the layout of the fields |
 *
 *
 * ## Captcha
 *
 * If you wish to use a captcha (google recaptcha v2) in your form, you need to load the `captcha` widget using `import { CaptchaWidget } from 'renditon/dist/extra/Form/captcha'` and pass it to extraFormats, see: [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Form/story.js).
 *
 * In order for the captcha to work, you also need to set a valid recaptcha API key to the `window.RECAPTCHA_V2_API_KEY` variable.
 * A gotcha with the captcha widget is, upon submitting, you need to reset the captcha form value where you manage its state. Google only allows a captcha value (generated by clicking the captcha widget) to be verified only once against their API, after which it will be invalid so it needs to be reset.
 *
 */
export const Form = BaseForm;
