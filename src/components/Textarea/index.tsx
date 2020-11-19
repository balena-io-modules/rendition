import {
	TextArea as GrommetTextArea,
	TextAreaProps as GrommetTextAreaProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { monospace } from '../../utils';

const getBorderColor = (props: InternalTextareaProps & { theme: any }) => {
	if (props.invalid) {
		return props.theme.colors.danger.main;
	}
	if (props.valid) {
		return props.theme.colors.success.main;
	}
};

const StyledGrommetTextArea = styled(GrommetTextArea)`
	${monospace};

	padding: 14px 20px;
	color: ${(props) => props.theme.colors.text.main};
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
	border-color: ${getBorderColor};

	resize: vertical;
	display: block;
	width: 100%;

	&:focus {
		border-color: ${(props) => props.theme.colors.tertiary.main};
	}
`;

const BaseTextearea = ({
	autoRows,
	maxRows,
	minRows,
	rows,
	...props
}: InternalTextareaProps) => {
	let rowsProp = rows;

	if (autoRows && props.onChange) {
		rowsProp = (props.value || '').split('\n').length;
	}

	if (maxRows && (rowsProp || 0) > maxRows) {
		rowsProp = maxRows;
	}

	if (minRows && (rowsProp || 0) < minRows) {
		rowsProp = minRows;
	}

	return <StyledGrommetTextArea rows={rowsProp} {...props} />;
};

export interface InternalTextareaProps
	extends React.HTMLAttributes<HTMLElement>,
		GrommetTextAreaProps {
	/** If true, render text in a monospace font */
	monospace?: boolean;

	autoComplete?: string;
	autoFocus?: boolean;
	cols?: number;
	dirName?: string;
	disabled?: boolean;
	form?: string;
	maxLength?: number;
	minLength?: number;
	readOnly?: boolean;
	required?: boolean;
	rows?: number;
	wrap?: string;
	/** A function that is called when the textarea value changes */
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
	/** If true, the textarea `rows` property will be changed automatically based on the content of the textarea, this behaviour will only work with a [controlled input](https://reactjs.org/docs/forms.html#controlled-components) (i.e. you have used the `onChange` property */
	autoRows?: boolean;
	/** Set the maximum number of rows */
	maxRows?: number;
	/** Set the minimum number of rows */
	minRows?: number;

	invalid?: boolean;
	valid?: boolean;
}

export type TextareaProps = InternalTextareaProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Textarea/Textarea.stories.tsx) */
export const Textarea = asRendition<React.FunctionComponent<TextareaProps>>(
	BaseTextearea,
);
