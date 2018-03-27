import map = require('lodash/map');
import * as React from 'react';
import { Schema } from 'rendition';
import DataTypes from '../DataTypes';
import { Flex } from '../Grid';
import Select from '../Select';

const FilterInput = (props: any) => {
	const DataTypeInput = DataTypes[props.type as keyof typeof DataTypes].Edit;

	return (
		<DataTypeInput
			schema={props.schema}
			value={props.value}
			operator={props.operator}
			onUpdate={props.onChange}
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
				{map(
					DataTypes[subSchema.type as keyof typeof DataTypes].operators,
					({ value, label }) => (
						<option value={value} key={value}>
							{label}
						</option>
					),
				)}
			</Select>
			{inputModels[name!].type !== 'Boolean' && (
				<FilterInput
					operator={operator}
					schema={schema[name!]}
					value={value}
					onChange={(value: string) => handleEditChange(value, 'value')}
					type={inputModels[name!].type}
					autoFocus
				/>
			)}
		</Flex>
	);
};

export default FilterForm;
