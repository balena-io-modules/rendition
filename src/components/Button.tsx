import { Button, ButtonProps as GrommetButtonProps } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import {
	Coloring,
	DefaultProps,
	Omit,
	RenditionSystemProps,
	ResponsiveStyle,
	Sizing,
	Theme,
} from '../common-types';
import { bold, getColor, getColoringType, normal, px } from '../utils';

const ButtonBase = styled(Button)`
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

const Plain = styled(ButtonBase)`
	color: ${props =>
		getColor(props, 'color', 'main') || props.theme.colors.text.main};
	height: auto;
	font-weight: ${props => normal(props)};
	border-radius: 0;

	&:hover:enabled,
	&:focus:enabled,
	&:active:enabled {
		border-bottom: 1px solid;
	}
`;

const underlineButtonActiveStyles = (props: ThemedButtonProps) => `
	color: ${getColor(props, 'color', 'main') || props.theme.colors.text.main};
	background: none;
	box-shadow: 0px -1px 0 0px inset;
`;

const Underline = styled(Plain).attrs({
	plain: true,
})`
	${props => (props.active ? underlineButtonActiveStyles(props) : '')}
	border-bottom: 1px solid;
	background: none;

	&:hover:enabled,
	&:focus:enabled,
	&:active:enabled {
		${underlineButtonActiveStyles};
	}
`;

const getStyledButton = (
	{ outline, underline, plain, active }: ThemedButtonProps,
	isPrimary: boolean,
) => {
	if (plain) {
		return Plain;
	}

	if (underline) {
		return Underline;
	}

	if ((outline && !active) || !isPrimary) {
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
		plain,
		active,
		...restProps
	} = props;

	// The 'primary' and 'color' props map to semantically different properties in
	// grommet, so mapping is performed here to keep the styling cleaner.
	// In grommet, 'primary' indicates that the button is filled with a solid
	// color, whereas in rendition 'primary' is a shorthand for the primary theme
	// color. In grommet 'color' refers to the fill or outline color of the
	// button, whereas in rendition it refers to the text color of the button
	let basePrimary =
		!!props.bg ||
		(!!getColoringType(props) && !outline && !underline && !props.plain);
	let baseColor = props.bg || getColor(props, 'bg', 'main');

	// If the button is active, invert the background and text colors
	if (active) {
		basePrimary = !basePrimary;
		if (basePrimary && !baseColor) {
			// If there is no base color, use the 'tertiary' color as a default
			baseColor = getColor(
				{ tertiary: true, theme: props.theme },
				'bg',
				'main',
			);
		}
	}

	const StyledButton = getStyledButton(props, basePrimary);

	// Note that the 'plain' property is case to a Boolean to simplify Grommets
	// default behaviour when providing an icon attribute and no label
	// see: https://github.com/grommet/grommet/issues/3030
	return (
		<StyledButton
			primary={basePrimary}
			color={baseColor}
			active={active && (underline || plain)}
			{...restProps}
			plain={!!plain || !!underline}
			label={label || children}
		/>
	);
};

interface ButtonBaseProps extends Coloring, Sizing {
	width?: ResponsiveStyle;
	bg?: string;
	outline?: boolean;
	underline?: boolean;
}

// Grommet has its own declaration for the 'onClick' attribute, so the default
// one is omitted as Grommet takes precedence here
export interface InternalButtonProps
	extends ButtonBaseProps,
		Omit<DefaultProps, 'onClick'>,
		GrommetButtonProps {
	type?: 'submit' | 'reset' | 'button';
	label?: 'string' | JSX.Element;
}

export type ButtonProps = InternalButtonProps & RenditionSystemProps;

export interface ThemedButtonProps extends ButtonProps {
	theme: Theme;
}

export default asRendition<ButtonProps>(
	Base,
	[],
	['width', 'color', 'bg'],
) as React.FunctionComponent<ButtonProps>;
