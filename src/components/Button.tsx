import { Button, ButtonProps as GrommetButtonProps } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import {
	Coloring,
	DefaultProps,
	EnhancedType,
	Omit,
	ResponsiveStyle,
	Sizing,
	Theme,
} from '../common-types';
import { bold, getColor, getColoringType, normal, px } from '../utils';

interface ButtonBaseProps extends Coloring, Sizing {
	width?: ResponsiveStyle;
	bg?: string;
	outline?: boolean;
	underline?: boolean;
}

// Grommet has its own declaration for the 'onClick' attribute, so the default
// one is omitted as Grommet takes precedence here
export interface ButtonProps
	extends ButtonBaseProps,
		Omit<DefaultProps, 'onClick'>,
		GrommetButtonProps {
	type?: 'submit' | 'reset' | 'button';
	label?: 'string' | JSX.Element;
}

export interface ThemedButtonProps extends ButtonProps {
	theme: Theme;
}

// TODO: remove the border-radius style once this issue is resolved
// https://github.com/grommet/grommet/issues/3030
const ButtonBase = styled(Button)`
	border-radius: ${props => props.theme.button.border.radius};

	font-family: ${props => props.theme.titleFont};
	font-weight: ${props => bold(props)};
	height: ${props => px(props.theme.space[4])};

	svg {
		color: inherit !important;
		font-size: 0.875em;
	}

	/* These rules cause consistent styling when the button is rendered as a link */
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

const ColouredButton = styled(ButtonBase)`
	color: white;
`;

const Outline = styled(ButtonBase)`
	color: ${props =>
		getColor(props, 'color', 'main') || props.theme.colors.text.main};
`;

const Plaintext = styled(ButtonBase)`
	color: ${props =>
		getColor(props, 'color', 'main') || props.theme.colors.text.main};
	height: auto;
	font-weight: ${props => normal(props)};
	border-radius: 0;
`;

const underlineButtonActiveStyles = (props: ThemedButtonProps) => `
	color: ${getColor(props, 'color', 'main') || props.theme.colors.text.main};
	background: none;
	box-shadow: 0px -1px 0 0px inset;
`;

const Underline = styled(Plaintext).attrs({
	plain: true,
})`
	${props => (props.active ? underlineButtonActiveStyles(props) : '')}
	border-bottom: 1px solid;

	&:hover:enabled,
	&:focus:enabled,
	&:active:enabled {
		${underlineButtonActiveStyles};
	}
`;

const getStyledButton = (
	{ outline, underline, plain }: ThemedButtonProps,
	isPrimary: boolean,
) => {
	if (plain) {
		return Plaintext;
	}

	if (underline) {
		return Underline;
	}

	if (outline || !isPrimary) {
		return Outline;
	}

	return ColouredButton;
};

const Base = (props: ThemedButtonProps) => {
	const {
		outline,
		underline,
		children,
		label,
		primary,
		color,
		...restProps
	} = props;

	// the 'primary' and 'color' props map to semantically different properties in
	// grommet, so you perform the mapping here to keep the styling cleaner.
	// In grommet, 'primary' indicates that the button is filled with a solid
	// color, whereas in rendition 'primary' is a shorthand for the primary theme
	// color. In grommet 'color' referes to the fill or outline color of the
	// button, whereas in grommet it refers to the text color of the button
	const basePrimary =
		!!props.bg ||
		(!!getColoringType(props) && !outline && !underline && !props.plain);
	const baseColor = props.bg || getColor(props, 'bg', 'main');

	const StyledButton = getStyledButton(props, basePrimary);

	return (
		<StyledButton
			primary={basePrimary}
			color={baseColor}
			{...restProps}
			label={label || children}
		/>
	);
};

export default asRendition<ButtonProps>(Base) as React.ComponentClass<
	EnhancedType<ButtonProps>
>;
