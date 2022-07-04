import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';
import { Box } from '../Box';
import { Flex } from '../Flex';
import { Modal } from '../Modal';
import { Select } from '../Select';
import { Txt } from '../Txt';
import * as SchemaSieve from './SchemaSieve';
import { Form } from '../Form';
import { getDataModel } from '../DataTypes';
export interface FilterFieldOption {
	field: string;
	title: string;
}

export type FilterFieldCompareFn = (
	a: FilterFieldOption,
	b: FilterFieldOption,
) => number;

export interface FilterModalProps {
	addFilter: (filters: EditModel[]) => void;
	onClose: () => void;
	schema: JSONSchema;
	edit: EditModel[];
	fieldCompareFn?: FilterFieldCompareFn;
}
export interface FilterInputProps {
	schema: JSONSchema;
	value: any;
	operator: string;
	onUpdate: (value: any) => void;
}
export interface EditModel {
	field: string;
	operator: string;
	value: string | number | { [k: string]: string };
}

const defaultFilterCompareFn: FilterFieldCompareFn = (a, b) => {
	return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
};

const FilterInput = ({
	schema,
	value,
	operator,
	onUpdate,
}: FilterInputProps) => {
	const model = getDataModel(schema);
	const uiSchema = model && 'uiSchema' in model ? model.uiSchema : {};
	if (model && 'Edit' in model) {
		const Edit = model.Edit as React.FC<any>;
		return (
			<Edit
				schema={schema}
				value={value}
				operator={operator}
				onUpdate={onUpdate}
				slim
			/>
		);
	}
	return (
		<Form
			schema={schema}
			value={value}
			onFormChange={({ formData }) => onUpdate(formData)}
			uiSchema={{ 'ui:options': { label: false, inline: true }, ...uiSchema }}
			hideSubmitButton
		/>
	);
};

const RelativeBox = styled(Box)`
	position: relative;
`;

const DeleteButton = styled(Button)`
	color: rgba(0, 0, 0, 0.4);
	position: absolute;
	bottom: 7px;
	right: -35px;
`;

export const FilterModal = ({
	addFilter,
	onClose,
	schema,
	edit,
	fieldCompareFn,
}: FilterModalProps) => {
	const [filters, setFilters] = useState(edit);
	const [searchTerm, setSearchTerm] = useState('');

	const debouncedSetSearchTerm = debounce(setSearchTerm, 300);

	const setEditField = (field: string, index: number) => {
		const currentEdit = filters.map((filter, i) =>
			i === index ? SchemaSieve.getCleanEditModel(schema, field) : filter,
		);
		setFilters(currentEdit);
		setSearchTerm('');
	};

	const setEditOperator = (operator: string, index: number) => {
		const currentEdit = filters.map((filter, i) =>
			i === index ? { ...filter, operator } : filter,
		);
		setFilters(currentEdit);
	};

	const setEditValue = (value: string, index: number) => {
		const currentEdit = filters.map((filter, i) =>
			i === index ? { ...filter, value } : filter,
		);
		setFilters(currentEdit);
	};

	const removeCompound = (index: number) => {
		const currentEdit = filters.reduce(
			(acc, cur, i) => (i === index ? acc : [...acc, cur]),
			[],
		);
		setFilters(currentEdit);
	};

	const fieldOptions: FilterFieldOption[] = React.useMemo(() => {
		return map(schema.properties, (s: JSONSchema, field) => ({
			field,
			title: s.title || field,
		})).sort(fieldCompareFn || defaultFilterCompareFn);
	}, [schema.properties]);

	const filteredFieldOptions = React.useMemo(() => {
		if (!searchTerm) {
			return fieldOptions;
		}
		const searchTermRegEx = new RegExp(searchTerm, 'i');
		return fieldOptions.filter((option) => {
			return (
				option.title.match(searchTermRegEx) ||
				option.field.match(searchTermRegEx)
			);
		});
	}, [searchTerm, fieldOptions]);

	return (
		<Modal
			title="Filter by"
			cancel={onClose}
			done={() => addFilter(filters)}
			action="Save"
		>
			{filters.map(({ field, operator, value }, index) => {
				const operators = SchemaSieve.getOperators(schema, field);
				return (
					<RelativeBox key={index}>
						{index > 0 && <Txt my={2}>OR</Txt>}
						<Flex>
							<Box flex={1}>
								<Select<{ field: string; title: string }>
									id="filtermodal__fieldselect"
									options={filteredFieldOptions}
									onSearch={debouncedSetSearchTerm}
									searchPlaceholder="Search..."
									valueKey="field"
									labelKey="title"
									// TODO: Remove this logic and pass the primitive value when this is fixed https://github.com/grommet/grommet/issues/3154
									value={
										schema.properties
											? {
													field,
													title:
														(schema.properties[field] as JSONSchema).title ||
														field,
											  }
											: { field }
									}
									onChange={({ option }) => setEditField(option.field, index)}
								/>
							</Box>
							{operators.length === 1 && (
								<Txt py={2} px={3} align="center">
									{operators[0].label}
								</Txt>
							)}
							{operators.length > 1 && (
								<Box flex={1} mx={1}>
									<Select<{ slug: string; label: any }>
										options={operators}
										valueKey="slug"
										labelKey="label"
										// TODO: Remove this logic and pass the primitive value when this is fixed: https://github.com/grommet/grommet/issues/3154
										value={operators.find((x) => x.slug === operator)}
										onChange={({ option }) =>
											setEditOperator(option.slug, index)
										}
									/>
								</Box>
							)}
							<Flex flex={1} alignItems="center">
								<FilterInput
									operator={operator}
									value={value}
									schema={schema.properties![field] as JSONSchema}
									onUpdate={(v: any) => setEditValue(v, index)}
								/>
							</Flex>
						</Flex>
						{index > 0 && (
							<DeleteButton
								plain
								fontSize={1}
								p={1}
								onClick={() => removeCompound(index)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</DeleteButton>
						)}
					</RelativeBox>
				);
			})}
			<Button
				mb={2}
				mt={4}
				primary
				underline
				onClick={() =>
					setFilters(filters.concat(SchemaSieve.getCleanEditModel(schema)))
				}
			>
				Add alternative
			</Button>
		</Modal>
	);
};
