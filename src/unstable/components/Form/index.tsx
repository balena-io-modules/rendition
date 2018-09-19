import { JSONSchema6 } from 'json-schema';
import isEqual = require('lodash/isEqual');
import omit = require('lodash/omit');
import * as React from 'react';
import Form, { IChangeEvent } from 'react-jsonschema-form';
import { FormProps } from 'rendition/dist/unstable';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { Box } from '../../../components/Grid';
import * as utils from '../../../utils';
import { DescriptionField } from './fields/DescriptionField';
import { TitleField } from './fields/TitleField';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import FieldTemplate from './templates/FieldTemplate';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate';
import BaseInput from './widgets/BaseInput';

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

const widgets: {
	[k: string]: any;
} = {
	BaseInput,
};

const fields: {
	[k: string]: any;
} = {
	DescriptionField,
	TitleField,
};

const FormWrapper = styled(Box)`
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}
`;

export default class FormHOC extends React.Component<
	FormProps,
	{ value: any; schema: JSONSchema6 }
> {
	constructor(props: FormProps) {
		super(props);

		this.state = {
			value: this.props.value || {},
			schema: this.parseSchema(this.props.schema),
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
		} = this.props;

		const cleanProps = omit(this.props, [
			'schema',
			'submitButtonText',
			'hideSubmitButton',
			'submitButtonProps',
			'value',
			'onFormChange',
			'onFormSubmit',
			'uiSchema',
		]);

		return (
			<FormWrapper {...cleanProps}>
				<Form
					schema={this.state.schema}
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
					{hideSubmitButton && <span />}

					{!hideSubmitButton && (
						<Button primary {...submitButtonProps}>
							{submitButtonText || 'Submit'}
						</Button>
					)}
				</Form>
			</FormWrapper>
		);
	}
}
