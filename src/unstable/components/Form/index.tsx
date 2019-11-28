import { JSONSchema6 } from 'json-schema';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import * as React from 'react';
import Form, { IChangeEvent } from 'react-jsonschema-form';
import styled from 'styled-components';
import { Box } from '../../../components/Box';
import Button from '../../../components/Button';
import * as utils from '../../../utils';
import { FormProps } from '../../unstable-typings';
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

	// Style the error list, since it can't be templated
	.panel-danger,
	.error-detail {
		font-size: ${props => utils.px(get(props, 'theme.fontSizes[1]', 14))};
		margin-top: ${props => utils.px(get(props, 'theme.space[1]', 4))};
		margin-bottom: ${props => utils.px(get(props, 'theme.space[1]', 4))};
		list-style-type: none;
		padding-left: 0;
	}

	.text-danger {
		color: ${props => get(props, 'theme.colors.danger.main', '#a94442')};
	}
`;

const parseSchema = (schema: JSONSchema6) => {
	const whitelist = SUPPORTED_SCHEMA_FORMATS.concat(Object.keys(widgets));
	return utils.stripSchemaFormats(schema, whitelist);
};

interface FormState {
	value: any;
	schema: JSONSchema6;
}

export default class FormHOC extends React.Component<FormProps, FormState> {
	private formRef = React.createRef<Form<any>>();

	static getDerivedStateFromProps(props: FormProps, state: FormState) {
		if (!state) {
			return { schema: parseSchema(props.schema), value: props.value };
		}

		if (!isEqual(state.value, props.value)) {
			return {
				value: props.value,
			};
		}
	}

	static registerWidget(name: string, value: any) {
		widgets[name] = value;
	}

	componentDidUpdate(prevProps: FormProps) {
		if (!isEqual(this.props.schema, prevProps.schema)) {
			this.setState({
				schema: parseSchema(this.props.schema),
			});
		}
	}

	change = (data: IChangeEvent) => {
		this.setState({ value: data.formData });

		if (this.props.onFormChange) {
			this.props.onFormChange(data);
		}
	};

	submit = () => {
		if (this.formRef.current) {
			this.formRef.current.submit();
		}
	};

	render() {
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
