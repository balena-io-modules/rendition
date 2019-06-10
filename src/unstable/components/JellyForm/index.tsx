import * as jellyschema from 'jellyschema';
import { JSONSchema6 } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import * as React from 'react';
import { BaseFormProps } from '../../unstable-typings';
import { default as Form } from '../Form';
import { defaultValueForSchema, runFormulas } from './formulas';

export interface JellyFormProps extends BaseFormProps {
	schema: string;
}

const computeFormSchemas = (jellySchema: string, uiSchema: any) => {
	const computed = jellyschema.generateJsonAndUiSchema(jellySchema);

	return {
		schema: computed.jsonSchema,

		// Merge the UI schema that is computed from the Jelly schema with any UI
		// Schema provided via props. This allows the computed values to be
		// overridden or augmented.
		uiSchema: merge({}, computed.uiSchema, uiSchema),
	};
};

interface JellyFormState {
	schema: any;
	uiSchema: any;
	value: any;
}

class JellyForm extends React.Component<JellyFormProps, JellyFormState> {
	constructor(props: JellyFormProps) {
		super(props);

		const { schema, uiSchema } = computeFormSchemas(
			props.schema,
			props.uiSchema,
		);

		this.state = {
			value: props.value || defaultValueForSchema(schema),
			schema,
			uiSchema,
		};
	}

	componentWillReceiveProps(nextProps: JellyFormProps) {
		if (!isEqual(this.props.value, nextProps.value)) {
			this.setState({
				value: runFormulas(this.state.schema, nextProps.value),
			});
		}

		if (
			!isEqual(this.props.schema, nextProps.schema) ||
			!isEqual(this.props.uiSchema, nextProps.uiSchema)
		) {
			const { schema, uiSchema } = computeFormSchemas(
				nextProps.schema,
				nextProps.uiSchema,
			);

			this.setState({
				schema,
				uiSchema,
			});
		}
	}

	onChange = (changeData: any) => {
		const { formData } = changeData;
		const schema = this.state.schema as JSONSchema6;
		const data = cloneDeep(formData);

		const evaluate = runFormulas(schema, data);
		const startingState = defaultValueForSchema(schema);
		const result = merge(startingState, formData, evaluate);

		this.setState({ value: result });

		if (this.props.onFormChange) {
			this.props.onFormChange({
				...changeData,
				formData: result,
			});
		}
	};

	render() {
		const { value, schema, uiSchema } = this.state;

		const options: Partial<BaseFormProps> = omit(this.props, [
			'value',
			'schema',
			'uiSchema',
			'onFormChange',
		]);

		return (
			<Form
				value={value}
				schema={schema as JSONSchema6}
				uiSchema={uiSchema}
				onFormChange={this.onChange}
				{...options}
			/>
		);
	}
}

export default JellyForm;
