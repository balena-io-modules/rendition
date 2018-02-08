import map = require('lodash/map');
import * as React from 'react';
import { Schema } from 'rendition';
import { Flex } from '../Grid';
import PineTypes from '../PineTypes';
import Select from '../Select';

const FilterInput = (props: any) => {
	const PineTypeInput = PineTypes[props.type].Edit;

	return (
		<PineTypeInput
			schema={props.schema}
			value={props.value}
			operator={props.operator}
			onChange={props.onChange}
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
				{map(inputModels[name!].availableOperators, ({ value, label }) => (
					<option value={value} key={value}>
						{label}
					</option>
				))}
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
