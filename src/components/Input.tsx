import {
	TextInput as GrommetTextInput,
	TextInputProps as GrommetTextInputProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps, Omit, RenditionSystemProps } from '../common-types';
import { emphasized, monospace } from '../utils';

const getBorderColor = (props: InternalInputProps & { theme: any }) => {
	if (props.invalid) {
		return props.theme.colors.danger.main;
	}
	if (props.valid) {
		return props.theme.colors.success.main;
	}
};

const StyledGrommetInput = styled(GrommetTextInput)<{
	emphasized?: boolean;
	monospace?: boolean;
}>`
	${monospace};
	${emphasized};
	padding: ${props => (props.emphasized ? '14px' : '10px')};
	padding-left: 20px;

	color: ${props => props.theme.colors.text.main};
	cursor: ${props => (props.disabled ? 'not-allowed' : 'auto')};
	border-color: ${getBorderColor};

	&:focus {
		border-color: ${props => props.theme.colors.tertiary.main};
	}
`;

const Input = ({ ...otherProps }: InternalInputProps) => {
	return <StyledGrommetInput {...otherProps} />;
};

// TODO: Fix all typings in grommet
export interface InternalInputProps
	extends Omit<GrommetTextInputProps, 'placeholder'>,
		Omit<DefaultProps, 'onSelect'> {
	onChange?: React.ChangeEventHandler<HTMLInputElement>;

	placeholder?: string;
	type?: string;
	autoFocus?: boolean;
	readOnly?: boolean;
	disabled?: boolean;
	pattern?: string;

	invalid?: boolean;
	valid?: boolean;
	emphasized?: boolean;
	monospace?: boolean;
}

export type InputProps = InternalInputProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<InputProps>>(Input);
