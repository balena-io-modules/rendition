import isEqual = require('lodash/isEqual');
import * as React from 'react';
import Form from 'react-jsonschema-form';
import { FormProps } from 'rendition/dist/unstable';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { Box } from '../../../components/Grid';
import FieldTemplate from './FieldTemplate';
import BaseInput from './widgets/BaseInput';

const widgets = {
	BaseInput,
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
	{ value: any }
> {
	constructor(props: FormProps) {
		super(props);

		this.state = {
			value: this.props.value || {},
		};

		this.change = this.change.bind(this);
	}

	componentWillReceiveProps(nextProps: FormProps) {
		if (!isEqual(this.props.value, nextProps.value)) {
			this.setState({
				value: nextProps.value,
			});
		}
	}

	change = (data: any) => {
		this.setState({ value: data.formData });

		if (this.props.onChange) {
			this.props.onChange(data);
		}
	};

	submit = (data: any) => {
		if (this.props.onSubmit) {
			this.props.onSubmit(data);
		}
	};

	render() {
		const {
			hideSubmitButton,
			submitButtonText,
			schema,
			uiSchema,
			onChange,
			onSubmit,
			value,
			...props
		} = this.props;

		return (
			<FormWrapper {...props}>
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
						<Button primary>{submitButtonText || 'Submit'}</Button>
					)}
				</Form>
			</FormWrapper>
		);
	}
}
