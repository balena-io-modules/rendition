import { JSONSchema6 } from 'json-schema';
import {
	Field,
	FormProps as JsonSchemaFormProps,
	IChangeEvent,
	UiSchema,
	Widget,
} from 'react-jsonschema-form';
import { ButtonProps } from '../components/Button';
import { BoxProps } from '../components/Grid';

export interface FormButtonProps extends ButtonProps {
	type?: 'submit' | 'reset' | 'button';
}

export type AnyObject = {
	[index: string]: any;
};

/**
 * Properties passed to custom Form widgets
 *
 * @see https://github.com/mozilla-services/react-jsonschema-form#custom-widget-components
 */
export interface FormWidgetProps {
	/** The generated id for this field */
	id: string;

	/** The JSONSchema subschema object for this field */
	schema: JSONSchema6;

	/** The current value for this field */
	value: any;

	label: string;

	/** The required status of this field */
	required: boolean;

	/** true if the widget is disabled */
	disabled: boolean;

	/** true if the widget should be autofocused */
	autofocus: boolean;

	/** the placeholder value for the widget */
	placeholder: string;

	/** true if the widget is read-only */
	readonly: boolean;

	/** The value change event handler; call it with the new value everytime it changes */
	onChange: (value: any) => void;

	/** The input blur event handler; call it with the the widget id and value */
	onBlur: (id: string, value: any) => void;

	/** The input focus event handler; call it with the the widget id and value */
	onFocus: (id: string, value: any) => void;

	/**
	 * A map of options passed as a prop to the component
	 * @see https://github.com/mozilla-services/react-jsonschema-form#custom-widget-options
	 */
	options: AnyObject;

	registry: {
		fields: { [name: string]: Field };
		widgets: { [name: string]: Widget };
		definitions: { [name: string]: any };
		formContext: any;
	};

	/** The formContext object that you passed to Form. */
	formContext: any;

	type?: string;
}

export interface RenditionUiSchema extends UiSchema {
	'ui:warning'?: string;
}

export interface BaseFormProps
	extends BoxProps,
		Pick<JsonSchemaFormProps<any>, 'validate' | 'noValidate' | 'liveValidate'> {
	submitButtonText?: string | JSX.Element;
	hideSubmitButton?: boolean;
	submitButtonProps?: ButtonProps;
	value?: number | string | boolean | AnyObject | any[] | null;
	onFormChange?: (result: IChangeEvent) => void;
	onFormSubmit?: (result: any) => void;
	uiSchema?: RenditionUiSchema;
}

export interface FormProps extends BaseFormProps {
	schema: JSONSchema6;
}
