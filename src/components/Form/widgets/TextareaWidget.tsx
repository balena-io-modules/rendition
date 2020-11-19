import * as React from 'react';
import { Textarea } from '../../Textarea';
import { FormWidgetProps } from '../';

function TextareaWidget(props: FormWidgetProps) {
	const {
		id,
		options,
		placeholder,
		value,
		required,
		disabled,
		readonly,
		autofocus,
		onChange,
		onBlur,
		onFocus,
	} = props;

	return (
		<Textarea
			id={id}
			className="form-control"
			value={typeof value === 'undefined' ? '' : value}
			placeholder={placeholder}
			required={required}
			disabled={disabled}
			readOnly={readonly}
			autoFocus={autofocus}
			rows={options.rows as number}
			onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
			onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
			onChange={
				onChange &&
				((event) =>
					onChange(
						event.target.value === '' ? options.emptyValue : event.target.value,
					))
			}
		/>
	);
}

export default TextareaWidget;
