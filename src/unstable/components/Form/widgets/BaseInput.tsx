import * as React from 'react';
import { FormWidgetProps } from 'rendition/dist/unstable';
import { Input } from '../../../../';

const BaseInput = (props: FormWidgetProps) => {
	// Note: since React 15.2.0 we can't forward unknown element attributes, so we
	// exclude the "options" and "schema" ones here.
	const {
		value,
		readonly,
		disabled,
		autofocus,
		onBlur,
		onFocus,
		options,
		schema,
		formContext,
		...inputProps
	} = props;

	// If options.inputType is set use that as the input type
	if (options.inputType) {
		inputProps.type = options.inputType;
	} else {
		// If the schema is of type number or integer, set the input type to number
		if (schema.type === 'number') {
			inputProps.type = 'number';
			// Setting step to 'any' fixes a bug in Safari where decimals are not
			// allowed in number inputs
			(inputProps as any).step = 'any';
		} else if (schema.type === 'integer') {
			inputProps.type = 'number';
			// Since this is integer, you always want to step up or down in multiples
			// of 1
			(inputProps as any).step = '1';
		} else {
			inputProps.type = 'text';
		}
	}

	// If multipleOf is defined, use this as the step value. This mainly improves
	// the experience for keyboard users (who can use the up/down KB arrows).
	if (schema.multipleOf) {
		(inputProps as any).step = schema.multipleOf;
	}

	const change = ({ target: { value } }: any) => {
		return props.onChange(value === '' ? options.emptyValue : value);
	};

	return (
		<Input
			w="100%"
			readOnly={readonly}
			disabled={disabled}
			autoFocus={autofocus}
			value={value == null ? '' : value}
			{...inputProps}
			onChange={change}
			onBlur={
				onBlur && ((event: any) => onBlur(inputProps.id, event.target.value))
			}
			onFocus={
				onFocus && ((event: any) => onFocus(inputProps.id, event.target.value))
			}
		/>
	);
};

export default BaseInput;
