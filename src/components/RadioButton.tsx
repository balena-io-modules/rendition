import {
	RadioButton as GrommetRadioButton,
	RadioButtonProps as GrommetRadioButtonProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Omit, RenditionSystemProps } from '../common-types';

import asRendition from '../asRendition';

// Override styles to match our styleguide
export const getHoverStyle = (props: any) => `
	& label:hover input:not([disabled]) + div,
	& label:hover input:not([disabled]) + span {
		box-shadow: 0 0 4px 0 rgba(221, 225, 240, 0.7);
		border-color: ${props.theme.colors.primary.main}
	}
`;

// TODO: Disabled style doesn't match our styleguide, but it is impossible to override it currently in the RadioButtonGroup component.
export const getBaseStyle = (props: any) => `
	& > label > span { 
		font-family: ${props.theme.font};
	}

	& > label input + div {
		border-color: ${props.theme.colors.primary.main};
	}
	& label input[checked] + div {
		background: ${props.theme.colors.primary.main};
	}

	& label[disabled] {
		opacity: 0.4
	}
`;

const RadioButtonWrapper = styled.div`
	${getBaseStyle}
	${getHoverStyle}
`;

const RadioButton = ({
	className,
	...otherProps
}: InternalRadioButtonProps) => {
	return (
		<RadioButtonWrapper className={className}>
			<GrommetRadioButton
				{...otherProps}
				name={otherProps.name || 'radio button'}
			/>
		</RadioButtonWrapper>
	);
};

// Make name optional, and override onChange to not be of `any` type.
interface InternalRadioButtonProps
	extends Omit<GrommetRadioButtonProps, 'onChange' | 'name'>,
		DefaultProps {
	name?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RadioButtonProps = InternalRadioButtonProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<RadioButtonProps>>(
	RadioButton,
);
