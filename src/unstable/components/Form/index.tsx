import { JSONSchema6 } from 'json-schema';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import * as React from 'react';
import Form, { IChangeEvent } from 'react-jsonschema-form';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { Box } from '../../../components/Grid';
import * as utils from '../../../utils';
import { FormProps } from '../../unstable-typings';
import { DescriptionField } from './fields/DescriptionField';
import ObjectField from './fields/ObjectField';
import { TitleField } from './fields/TitleField';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import FieldTemplate from './templates/FieldTemplate';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate';
import BaseInput from './widgets/BaseInput';
import SelectWidget from './widgets/SelectWidget';

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
};

const fields: {
	[k: string]: any;
} = {
	DescriptionField,
	ObjectField,
	TitleField,
};

const FormWrapper = styled(Box)`
	fieldset {
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
		color: ${props => get(props, 'theme.colors.danger.main', '#a94442')};
	}
`;

export default class FormHOC extends React.Component<
	FormProps,
	{ value: any; schema: JSONSchema6 }
> {
	constructor(props: FormProps) {
		super(props);

		this.state = {
			value: props.value || (props.schema.type === 'array' ? [] : {}),
			schema: this.parseSchema(props.schema),
		};
	}

	static registerWidget(name: string, value: any) {
		widgets[name] = value;
	}

	componentWillReceiveProps(nextProps: FormProps) {
		if (!isEqual(this.props.value, nextProps.value)) {
			this.setState({
				value: nextProps.value,
			});
		}

		if (!isEqual(this.props.schema, nextProps.schema)) {
			this.setState({
				schema: this.parseSchema(nextProps.schema),
			});
		}
	}

	parseSchema(schema: JSONSchema6) {
		const whitelist = SUPPORTED_SCHEMA_FORMATS.concat(Object.keys(widgets));
		return utils.stripSchemaFormats(schema, whitelist);
	}

	change = (data: IChangeEvent) => {
		this.setState({ value: data.formData });

		if (this.props.onFormChange) {
			this.props.onFormChange(data);
		}
	};

	submit = (data: any) => {
		if (this.props.onFormSubmit) {
			this.props.onFormSubmit(data);
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
			children,
			...props
		} = this.props;

		const localSchema = omit(
			utils.disallowAdditionalProperties(this.state.schema),
			KEYWORD_BLACKLIST,
		);

		const defaultChildren = hideSubmitButton ? (
			<span />
		) : (
			<Button primary {...submitButtonProps} type="submit">
				{submitButtonText || 'Submit'}
			</Button>
		);

		return (
			<FormWrapper {...props}>
				<Form
					liveValidate={liveValidate}
					noValidate={noValidate}
					validate={validate}
					showErrorList={false}
					schema={localSchema}
					formData={this.state.value}
					onSubmit={this.submit}
					onChange={this.change}
					uiSchema={uiSchema}
					widgets={widgets}
					fields={fields}
					FieldTemplate={FieldTemplate}
					ObjectFieldTemplate={ObjectFieldTemplate}
					ArrayFieldTemplate={ArrayFieldTemplate}
				>
					{children ? children : defaultChildren}
				</Form>
			</FormWrapper>
		);
	}
}
