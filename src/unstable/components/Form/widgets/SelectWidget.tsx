import * as React from 'react';
import { Select } from '../../../..';
import { FormWidgetProps } from '../../../unstable-typings';

const SelectWidget = (props: FormWidgetProps) => {
	const { id, options, value, disabled, readonly, onChange } = props;

	const { enumOptions, enumDisabled } = options;
	const selectOptions = enumOptions.map((option: any) => {
		return {
			...option,
			disabled: enumDisabled && enumDisabled.indexOf(option.value) !== -1,
		};
	});

	return (
		<Select
			width="100%"
			id={id}
			value={
				value ? selectOptions.find((option: any) => option.value === value) : ''
			}
			disabled={disabled || readonly}
			onChange={({ option }: any) => {
				onChange(option.value);
			}}
			options={selectOptions}
			valueKey="value"
			labelKey="label"
			disabledKey="disabled"
		/>
	);
};

export default SelectWidget;
