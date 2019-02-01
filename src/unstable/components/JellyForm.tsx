import * as cdsl from 'balena-cdsl';
import * as temen from 'balena-temen';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import set from 'lodash/set';
import * as React from 'react';
import { default as Form } from './Form';

console.log({ cdsl });
console.log({ temen });

const getFormulaKeys = function(obj: any, prefix: string = '') {
	const keys = Object.keys(obj);
	prefix = prefix ? prefix + '.' : '';
	return keys.reduce(
		function(result, key) {
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

interface JellyFormProps {
	schema: string;
}

interface JellyFormState {
	schema: {
		ui_object: any;
		json_schema: any;
	};
	formData: any;
}

class JellyForm extends React.Component<JellyFormProps, JellyFormState> {
	constructor(props: JellyFormProps) {
		super(props);

		const schema = cdsl.generate_ui(props.schema);

		console.log(schema);

		console.log(temen);

		schema.ui_object['ui:order'] = schema.json_schema.$$order;

		this.state = {
			formData: {},
			schema,
		};
	}

	onChange = ({ formData }: any) => {
		const { schema } = this.state;
		console.log(formData);

		console.log(getFormulaKeys(schema.json_schema));

		const keys = getFormulaKeys(schema.json_schema).map(path => {
			return {
				formula: get(schema.json_schema, path),
				path: path.replace(/properties\./g, ''),
			};
		});

		const data = cloneDeep(formData);

		keys.forEach(y => {
			set(data, y.path, y.formula);
		});

		console.log({ keys });

		console.log(data);

		let evaluate;

		try {
			evaluate = temen.evaluate(data);
		} catch (e) {
			console.error(e);
			evaluate = formData;
		}

		console.log(evaluate);

		this.setState({ formData: merge({}, formData, evaluate) });
	};

	render() {
		const { formData, schema } = this.state;

		return (
			<Form
				value={formData}
				schema={schema.json_schema}
				uiSchema={schema.ui_object}
				onFormChange={this.onChange}
			/>
		);
	}
}

export default JellyForm;
