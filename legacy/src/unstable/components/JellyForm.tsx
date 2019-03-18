import * as temen from 'balena-temen';
import * as jellyschema from 'jellyschema';
import { JSONSchema6 } from 'json-schema';
import cloneDeep = require('lodash/cloneDeep');
import get = require('lodash/get');
import isEqual = require('lodash/isEqual');
import isPlainObject = require('lodash/isPlainObject');
import merge = require('lodash/merge');
import omit = require('lodash/omit');
import set = require('lodash/set');
import * as React from 'react';
import { BaseFormProps } from 'rendition/dist/unstable';
import { JellyFormProps } from 'rendition/dist/unstable/components/JellyForm';
import { default as Form } from './Form';

const getFormulaKeys = function(obj: any, prefix: string = '') {
	const keys = Object.keys(obj);
	prefix = prefix ? prefix + '.' : '';
	return keys.reduce(
		(result, key) => {
			if (isPlainObject(obj[key])) {
				result = result.concat(getFormulaKeys(obj[key], prefix + key));
			} else if (key === '$$formula') {
				result.push(prefix + key);
			}
			return result;
		},
		[] as string[],
	);
};

// Given a JSON Schema, find all fields that have a formula field, evaluate the
// formula and then update the provided value with the result
const runFormulas = (schema: JSONSchema6, value: any) => {
	// Start by cloning the value to avoid any awkward mutation bugs
	const data = cloneDeep(value);

	// Find all the keypaths that use formulas
	const keys = getFormulaKeys(schema).map(path => {
		return {
			formula: get(schema, path),
			path: path.replace(/properties\./g, ''),
		};
	});

	// Replace each field that is the result of a formula with the formula itself.
	// This is done because the formula may reference other fields in the data
	// object, and they all need to be present when running the object through
	// temen.
	keys.forEach(y => {
		set(data, y.path, y.formula);
	});

	let evaluate;

	// Attempt to evaluate the final data object containing formulas, if there is
	// an error, then set the result to the original value.
	try {
		evaluate = temen.evaluate(data);
	} catch (e) {
		console.error('Caught error when evaluating formulas', e);
		evaluate = value;
	}
	const startingState = defaultValueForSchema(schema);
	return merge(startingState, value, evaluate);
};

const defaultValueForSchema = (schema: JSONSchema6) => {
	return schema.type === 'array' ? [] : {};
};

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
