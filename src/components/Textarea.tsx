import {
	TextArea as GrommetTextArea,
	TextAreaProps as GrommetTextAreaProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps, RenditionSystemProps } from '../common-types';
import { monospace } from '../utils';

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

	padding: 15px 20px;
	color: ${props => props.theme.colors.text.main};
	cursor: ${props => (props.disabled ? 'not-allowed' : 'auto')};
	border-color: ${getBorderColor};

	resize: vertical;
	display: block;
	width: 100%;

	&:focus {
		border-color: ${props => props.theme.colors.tertiary.main};
	}
`;

const Component = ({
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
	extends DefaultProps,
		GrommetTextAreaProps {
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

	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	autoRows?: boolean;
	maxRows?: number;
	minRows?: number;

	invalid?: boolean;
	valid?: boolean;
}

export type TextareaProps = InternalTextareaProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<TextareaProps>>(Component);
