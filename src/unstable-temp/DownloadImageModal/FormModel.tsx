import toNumber from 'lodash/toNumber';
import * as React from 'react';
import { Box } from '../../components/Box';
import { Checkbox } from '../../components/Checkbox';
import { Divider } from '../../components/Divider';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Collapsible } from './Collapsible';
import { PasswordInput } from './PasswordInput';
import styled from 'styled-components';
import { DeviceTypeOptions, DeviceTypeOptionsGroup } from './models';

export const DownloadImageLabel = styled.label`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 21px;
	font-size: 12px;
	margin-bottom: 8px;
	font-weight: normal;
`;

const matches = (
	condition: DeviceTypeOptionsGroup['when'],
	data: FormModel,
) => {
	if (!condition) {
		return true;
	}
	for (const k in condition) {
		if (!condition[k]) {
			continue;
		}
		if (condition[k] !== data[k]) {
			return false;
		}
	}

	return true;
};

const getDefaultValue = (options: DeviceTypeOptionsGroup) => {
	if (options.default) {
		return options.default;
	} else if (options.choices) {
		return options.choices[0];
	} else if (options.type === 'number' && options.min) {
		return options.min;
	}

	return undefined;
};

interface FormControlProps extends Omit<FormFieldsProps, 'options'> {
	options: DeviceTypeOptionsGroup;
}

const FormControl = ({ onModelChange, options, model }: FormControlProps) => {
	React.useEffect(() => {
		if (model[options.name]) {
			return;
		}

		const defaultVal = getDefaultValue(options);
		if (defaultVal != null) {
			onModelChange({ [options.name]: getDefaultValue(options) });
		}
	}, [options, model, onModelChange]);

	return (
		<div style={options.hidden ? { display: 'none' } : {}}>
			{options.hidden && (
				<input
					name={options.name}
					value={model[options.name] as string | number}
					onChange={(e) => onModelChange({ [options.name]: e.target.value })}
				/>
			)}

			{!options.hidden && (
				<>
					{options.type !== 'confirm' && (
						<DownloadImageLabel>{options.message}</DownloadImageLabel>
					)}

					{options.type === 'list' && options.choices?.length === 1 && (
						<div>
							<input
								type="hidden"
								name={options.name}
								value={model[options.name] as string | number}
								onChange={(e) =>
									onModelChange({ [options.name]: e.target.value })
								}
							/>
							<em>({options.choices[0]})</em>
						</div>
					)}

					{options.type === 'list' && options.choices?.length === 2 && (
						<>
							<input
								type="hidden"
								name={options.name}
								value={model[options.name] as string}
							/>
							<Box mr={4}>
								<RadioButtonGroup
									options={(options.choices as string[]).map((choice) => ({
										disabled: false,
										value: choice,
										label: options.choicesLabels?.[choice] ?? choice,
									}))}
									value={model[options.name]}
									onChange={(e) =>
										onModelChange({ [options.name]: e.target.value })
									}
								/>
							</Box>
						</>
					)}

					{options.type === 'list' && (options.choices?.length ?? 0) > 2 && (
						<Select<string>
							name={options.name}
							options={options.choices as string[]}
							width="100%"
							value={model[options.name] as string | undefined}
							onChange={({ option }) =>
								onModelChange({ [options.name]: option })
							}
						/>
					)}
					{options.type === 'confirm' && (
						<Checkbox
							mb={2}
							name={options.name}
							label={options.message}
							checked={model[options.name] as boolean | undefined}
							onChange={(e) =>
								onModelChange({ [options.name]: e.target.checked })
							}
						/>
					)}

					{options.type === 'number' && (
						<Input
							mb={2}
							type="number"
							name={options.name}
							onChange={(e) => {
								const parsed = toNumber(e.target.value);
								if (!isNaN(parsed)) {
									onModelChange({ [options.name]: parsed });
								}
							}}
							value={model[options.name] as number | undefined}
							min={options.min}
							max={options.max}
						/>
					)}
					{options.type === 'password' && (
						<Box mb={2}>
							<PasswordInput
								name={options.name}
								onChange={(e) =>
									onModelChange({ [options.name]: e.target.value })
								}
								value={model[options.name] as string | undefined}
								autoComplete="new-password"
							/>
						</Box>
					)}

					{(!options.type || options.type === 'text') && (
						<Input
							mb={2}
							type="text"
							name={options.name}
							onChange={(e) =>
								onModelChange({ [options.name]: e.target.value })
							}
							value={model[options.name] as string | undefined}
							autoComplete="new-password"
						/>
					)}
				</>
			)}
		</div>
	);
};

interface FormFieldProps extends Omit<FormFieldsProps, 'options'> {
	options: DeviceTypeOptionsGroup;
}

const FormField = ({ onModelChange, model, options }: FormFieldProps) => {
	const shouldShow = matches(options.when, model);
	if (!shouldShow) {
		return null;
	}

	return (
		<FormControl
			options={options}
			model={model}
			onModelChange={onModelChange}
		/>
	);
};

interface FormGroupProps extends Omit<FormFieldsProps, 'options'> {
	options: DeviceTypeOptions;
}

const FormGroup = ({ onModelChange, model, options }: FormGroupProps) => {
	return (
		<>
			<Divider type="dashed" />
			<Collapsible
				collapsible={!!options.isCollapsible}
				initiallyCollapsed={options.collapsed}
				title={options.message}
			>
				<FormFields
					onModelChange={onModelChange}
					options={options.options}
					model={model}
				/>
			</Collapsible>
		</>
	);
};

interface FormFieldsProps {
	onModelChange: (model: FormModel) => void;
	options: Array<DeviceTypeOptions | DeviceTypeOptionsGroup>;
	model: FormModel;
}

const FormFields = ({ onModelChange, model, options }: FormFieldsProps) => {
	return (
		<>
			{options.map((option) => {
				return (
					<React.Fragment key={option.name}>
						{(option as DeviceTypeOptions).isGroup && (
							<FormGroup
								onModelChange={onModelChange}
								model={model}
								options={option as DeviceTypeOptions}
							/>
						)}
						{!(option as DeviceTypeOptions).isGroup && (
							<FormField
								onModelChange={onModelChange}
								model={model}
								options={option as DeviceTypeOptionsGroup}
							/>
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};

export interface FormModel {
	[key: string]: boolean | number | string | undefined;
}

interface DownloadFormModelProps {
	model: FormModel;
	onModelChange: (model: FormModel) => void;
	options: DeviceTypeOptions[];
}

export const DownloadFormModel = ({
	model,
	onModelChange,
	options,
}: DownloadFormModelProps) => {
	if (!options) {
		return null;
	}

	return (
		<FormFields
			onModelChange={(updatedField) =>
				onModelChange({ ...model, ...updatedField })
			}
			model={model}
			options={options}
		></FormFields>
	);
};
