import assign = require('lodash/assign');
import isEqual = require('lodash/isEqual');
import omit = require('lodash/omit');
import * as React from 'react';
import Form, { IChangeEvent } from 'react-jsonschema-form';
import { FormProps } from 'rendition/dist/unstable';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { Box } from '../../../components/Grid';
import FieldTemplate from './FieldTemplate';
import BaseInput from './widgets/BaseInput';

const baseWidgets = {
	BaseInput,
};

const FormWrapper = styled(Box)`
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}
`;

const registeredWidgets: { [k: string]: any } = {};

export default class FormHOC extends React.Component<
	FormProps,
	{ value: any }
> {
	constructor(props: FormProps) {
		super(props);

		this.state = {
			value: this.props.value || {},
		};
	}

	static registerWidget(name: string, value: any) {
		registeredWidgets[name] = value;
	}

	componentWillReceiveProps(nextProps: FormProps) {
		if (!isEqual(this.props.value, nextProps.value)) {
			this.setState({
				value: nextProps.value,
			});
		}
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
			schema,
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

		const widgets = assign(baseWidgets, registeredWidgets);

		return (
			<FormWrapper {...cleanProps}>
				<Form
					schema={schema}
					formData={this.state.value}
					onSubmit={this.submit}
					onChange={this.change}
					uiSchema={uiSchema}
					widgets={widgets}
					FieldTemplate={FieldTemplate}
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
