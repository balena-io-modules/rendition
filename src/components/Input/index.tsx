import {
	TextInput as GrommetTextInput,
	TextInputProps as GrommetTextInputProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Omit, RenditionSystemProps } from '../../common-types';
import { emphasized, monospace } from '../../utils';

const getBorderColor = (
	props: Omit<InternalInputProps, 'dir'> & { theme: any },
) => {
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
	padding: ${(props) => (props.emphasized ? '14px' : '10px')};
	padding-left: 20px;

	color: ${(props) => props.theme.colors.text.main};
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
	border-color: ${getBorderColor};

	&:focus {
		border-color: ${(props) => props.theme.colors.tertiary.main};
	}
`;

const BaseInput = React.forwardRef(
	({ ...otherProps }: InternalInputProps, ref) => {
		// @ts-ignore The grommet typings don't include `ref`, but they do pass it to the input component.
		return <StyledGrommetInput {...otherProps} ref={ref} />;
	},
);

export interface InternalInputProps
	extends GrommetTextInputProps,
		Omit<React.HTMLAttributes<HTMLInputElement>, 'onSelect' | 'placeholder'> {
	/** A function that is called when the input value changes */
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	type?: string;
	autoFocus?: boolean;
	autoComplete?: string | boolean;
	readOnly?: boolean;
	disabled?: boolean;
	pattern?: string;
	maxLength?: number;
	form?: string;

	invalid?: boolean;
	valid?: boolean;
	/** If true, use a larger size */
	emphasized?: boolean;
	/** If true, render text in a monospace font */
	monospace?: boolean;
	list?: string;
}

export type InputProps = InternalInputProps &
	RenditionSystemProps & { ref?: React.Ref<HTMLInputElement | null> };

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Input/Input.stories.tsx) */
export const Input = asRendition<React.FunctionComponent<InputProps>>(
	BaseInput,
);
