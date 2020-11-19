import {
	RadioButton as GrommetRadioButton,
	RadioButtonProps as GrommetRadioButtonProps,
} from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Omit, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';

// We can rely on input[checked] to apply the styling, but Grommet broke it so we have to pass checked as a prop. Revert once this is fixed in grommet.
// Override styles to match our styleguide
export const getHoverStyle = (props: any) =>
	props.checked
		? `
	& label:hover input + div {
		border-color: ${props.theme.colors.primary.dark};
		background: ${props.theme.colors.primary.dark};
	},
`
		: '';

export const getCheckedStyle = (props: any) =>
	props.checked
		? `
	& label input + div {
		border-color: ${props.theme.colors.primary.main};
		background: ${props.theme.colors.primary.main};
	}
`
		: '';

export const getBaseStyle = (props: any) => `
	& > label > span {
		font-family: ${props.theme.font};
	}

	& label[disabled] {
		opacity: 0.4
	}
`;

const RadioButtonWrapper = styled.div<{ checked: boolean }>`
	${getBaseStyle}
	${getCheckedStyle}
	${getHoverStyle}
`;

const BaseRadioButton = ({
	className,
	...otherProps
}: InternalRadioButtonProps) => {
	return (
		<RadioButtonWrapper checked={!!otherProps.checked} className={className}>
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
		React.HTMLAttributes<HTMLElement> {
	/** The DOM name attribute value to use for the underlying <input/> element. */
	name?: string;
	/** Function called when the value of the radio button changes */
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RadioButtonProps = InternalRadioButtonProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/RadioButton/RadioButton.stories.tsx) */
export const RadioButton = asRendition<
	React.FunctionComponent<RadioButtonProps>
>(BaseRadioButton);
