import { JSONSchema6 } from 'json-schema';
import map = require('lodash/map');
import * as React from 'react';
import { Schema } from 'rendition';
import { getDataModel } from '../DataTypes';
import { Flex } from '../Grid';
import Select from '../Select';

const FilterInput = (props: {
	schema: JSONSchema6;
	value: any;
	operator: string;
	onChange: (e: any) => void;
}) => {
	const Model = getDataModel(props.schema);

	if (!Model) {
		return null;
	}

	return (
		<Model.Edit
			schema={props.schema}
			value={props.value}
			operator={props.operator}
			onUpdate={props.onChange}
			autofocus
		/>
	);
};

interface FilterFormProps {
	handleEditChange: (value: string, key: string) => void;
	inputModels: any;
	name: string;
	value: string;
	operator: string;
	schema: Schema;
}

const FilterForm = (props: FilterFormProps) => {
	const {
		handleEditChange,
		inputModels,
		name,
		value,
		operator,
		schema,
	} = props;
	const subSchema = (schema as any).properties[name];
	const Model = getDataModel(subSchema);

	if (!Model) {
		return null;
	}

	return (
		<Flex>
			<Select
				mr={20}
				value={name}
				onChange={(e: Event) =>
					handleEditChange((e.target as HTMLSelectElement).value, 'name')
				}
			>
				{map(inputModels, ({ name, label }) => (
					<option key={name} value={name}>
						{label || name}
					</option>
				))}
			</Select>
			<Select
				mr={20}
				value={operator}
				onChange={(e: Event) =>
					handleEditChange((e.target as HTMLSelectElement).value, 'operator')
				}
			>
				{map(Model.operators, ({ value, label }) => (
					<option value={value} key={value}>
						{label}
					</option>
				))}
			</Select>
			<FilterInput
				operator={operator}
				schema={schema[name!]}
				value={value}
				onChange={(value: string) => handleEditChange(value, 'value')}
			/>
		</Flex>
	);
};

export default FilterForm;
