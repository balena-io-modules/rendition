import * as React from 'react';
import { Input } from '../../../../';
import { FormWidgetProps } from '../../../unstable-typings';

const filterSuggestions = (text: string | null, suggestions?: string[]) => {
	if (!text || !suggestions) {
		return suggestions;
	}

	return suggestions.filter((suggestion) => suggestion.includes(text));
};

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

	if (schema.type === 'number') {
		inputProps.type = 'number';
	} else {
		inputProps.type = options.inputType || inputProps.type || 'text';
	}

	const change = ({ target: { value } }: any) => {
		return props.onChange(value === '' ? options.emptyValue : value);
	};

	const suggestions = filterSuggestions(value, schema.examples as string[]);
	const hasExamples = (schema.examples?.length ?? 0) > 0;

	return (
		<>
			<Input
				width="100%"
				readOnly={readonly}
				disabled={disabled}
				autoFocus={autofocus}
				// Form suggestions will clash with browser suggestions if autocomplete is on
				autoComplete={hasExamples ? 'off' : options.autocomplete}
				emphasized={options.emphasized}
				value={value == null ? '' : value}
				{...inputProps}
				onChange={change}
				onBlur={
					onBlur && ((event: any) => onBlur(inputProps.id, event.target.value))
				}
				onFocus={
					onFocus &&
					((event: any) => onFocus(inputProps.id, event.target.value))
				}
				onSelect={(e) => props.onChange(e.suggestion)}
				suggestions={suggestions}
				list={hasExamples ? 'dummy-datalist' : undefined}
			/>
			{/* In some versions of Chrome, just disabling autocomplete doesn't work, but having an empty datalist does */}
			{hasExamples && <datalist id="dummy-datalist" />}
		</>
	);
};

export default BaseInput;
