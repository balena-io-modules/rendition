import {
	RadioButton as GrommetRadioButton,
	RadioButtonProps as GrommetRadioButtonProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Omit, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';

// Override styles to match our styleguide
export const getHoverStyle = (props: any) => `
	& label:hover input[checked] + div {
		border-color: ${props.theme.colors.primary.dark};
		background: ${props.theme.colors.primary.dark};
	},
`;

export const getBaseStyle = (props: any) => `
	& > label > span {
		font-family: ${props.theme.font};
	}

	& label input[checked] + div {
		border-color: ${props.theme.colors.primary.main};
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
	extends Omit<GrommetRadioButtonProps, 'name'>,
		DefaultProps {
	name?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RadioButtonProps = InternalRadioButtonProps & RenditionSystemProps;
export default asRendition<React.FunctionComponent<RadioButtonProps>>(
	RadioButton,
);
