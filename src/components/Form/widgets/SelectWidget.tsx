import * as React from 'react';
import { Select } from '../../Select';
import { FormWidgetProps } from '../';

const SelectWidget = (props: FormWidgetProps) => {
	const { id, options, value, disabled, readonly, onChange } = props;

	const { enumOptions, enumDisabled } = options;
	const selectOptions = (enumOptions as any[])?.map((option) => {
		return {
			...option,
			disabled:
				enumDisabled && (enumDisabled as any[]).indexOf(option.value) !== -1,
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
			emphasized={options.emphasized as boolean}
			valueKey="value"
			labelKey="label"
			disabledKey="disabled"
		/>
	);
};

export default SelectWidget;
