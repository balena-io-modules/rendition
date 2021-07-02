import * as React from 'react';
import { Select } from '../../Select';
import { FormWidgetProps } from '../';

const SelectWidget = (props: FormWidgetProps) => {
	const { id, options, value, disabled, readonly, onChange } = props;

	const { enumOptions, enumDisabled } = options;
	if (!Array.isArray(enumOptions)) {
		return null;
	}
	const sanitizedEnumDisabled = Array.isArray(enumDisabled)
		? enumDisabled
		: null;
	const selectOptions = enumOptions.map((option) => {
		return {
			...option,
			disabled:
				sanitizedEnumDisabled != null &&
				sanitizedEnumDisabled.includes(option.value),
		};
	});

	return (
		<Select
			width="100%"
			id={id}
			value={
				value !== undefined
					? selectOptions.find((option) => option.value === value)
					: undefined
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
