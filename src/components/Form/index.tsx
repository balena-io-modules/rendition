import { JSONSchema7 as JSONSchema } from 'json-schema';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import * as React from 'react';
import Form, {
	IChangeEvent,
	FormProps as JsonSchemaFormProps,
	UiSchema,
	WidgetProps,
	Field,
	Widget,
} from '@rjsf/core';
import styled from 'styled-components';
import { Box, BoxProps } from '../Box';
import Button, { ButtonProps } from '../Button';
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

// Some keywords cause errors in RJSF validation, so they are removed from the
// schema before being passed as a prop
const KEYWORD_BLACKLIST = ['$schema'];

const widgets: {
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
`;

const parseSchema = (schema: JSONSchema) => {
	const whitelist = SUPPORTED_SCHEMA_FORMATS.concat(Object.keys(widgets));
	return utils.stripSchemaFormats(schema, whitelist);
};

interface FormState {
	value: any;
	schema: JSONSchema;
}

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

export interface BaseFormProps
	extends BoxProps,
		Pick<JsonSchemaFormProps<any>, 'validate' | 'noValidate' | 'liveValidate'> {
	submitButtonText?: string | JSX.Element;
	hideSubmitButton?: boolean;
	submitButtonProps?: ButtonProps;
	value?: number | string | boolean | { [index: string]: any } | any[] | null;
	onFormChange?: (result: IChangeEvent) => void;
	onFormSubmit?: (result: any) => void;
	uiSchema?: RenditionUiSchema;
}

export interface FormProps extends BaseFormProps {
	schema: JSONSchema;
}

export default class FormHOC extends React.Component<FormProps, FormState> {
	private formRef = React.createRef<Form<any>>();

	public static getDerivedStateFromProps(props: FormProps, state: FormState) {
		if (!state) {
			return { schema: parseSchema(props.schema), value: props.value };
		}

		if (!isEqual(state.value, props.value)) {
			return {
				value: props.value,
			};
		}
	}

	public static registerWidget(name: string, value: any) {
		widgets[name] = value;
	}

	public componentDidUpdate(prevProps: FormProps) {
		if (!isEqual(this.props.schema, prevProps.schema)) {
			this.setState({
				schema: parseSchema(this.props.schema),
			});
		}
	}

	public change = (data: IChangeEvent) => {
		this.setState({ value: data.formData });

		if (this.props.onFormChange) {
			this.props.onFormChange(data);
		}
	};

	public submit = () => {
		if (this.formRef.current) {
			this.formRef.current.submit();
		}
	};

	public render() {
		const {
			hideSubmitButton,
			submitButtonText,
			submitButtonProps,
			uiSchema,
			validate,
			liveValidate,
			noValidate,
			schema,
			value,
			onFormChange,
			onFormSubmit,
			...props
		} = this.props;

		const localSchema = omit(
			utils.disallowAdditionalProperties(this.state.schema),
			KEYWORD_BLACKLIST,
		);

		return (
			<FormWrapper {...props}>
				<Form
					ref={this.formRef}
					liveValidate={liveValidate}
					noValidate={noValidate}
					validate={validate}
					showErrorList={false}
					schema={localSchema}
					formData={this.state.value}
					onSubmit={this.props.onFormSubmit}
					onChange={this.props.onFormChange}
					uiSchema={uiSchema}
					widgets={widgets}
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
				</Form>
			</FormWrapper>
		);
	}
}
