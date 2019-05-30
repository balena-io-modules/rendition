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
import { getColor, getColoringType, normal } from '../utils';

const getHoverEffectOverride = (
	bg: string,
	color: string,
	opacity?: string,
) => {
	return `
		&:hover:enabled,
		&:focus:enabled,
		&:active:enabled {
			box-shadow: none;
			background: ${bg};
			border-color: ${bg};
			color: ${color};
			opacity: ${opacity};
		}
	`;
};

const ButtonBase = styled(Button)`
	font-family: ${props => props.theme.titleFont};
	font-weight: ${props => normal(props)};
	height: 38px;
	white-space: nowrap;
	svg {
		color: inherit !important;
		font-size: 0.875em;
	}
	/* These rules cause consistent styling when the button is rendered as a link */
	display: inline-flex;
	align-items: center;
	justify-content: center;

	&:disabled {
		cursor: not-allowed;
	}
`;

const ColouredButton = styled(ButtonBase)`
	color: white;
	${props => getHoverEffectOverride(getColor(props, 'color', 'dark'), 'white')};
`;

const Outline = styled(ButtonBase)<{ color?: string }>`
	color: ${props => props.color || props.theme.colors.text.main};
	border-color: ${props => props.color || props.theme.colors.text.main};
	${props =>
		getHoverEffectOverride(
			props.color || props.theme.colors.text.main,
			'white',
		)};
`;

const Light = styled(ButtonBase)`
	color: ${props => props.theme.colors.text.main};
	border-color: ${props => props.theme.colors.text.main};
	background: white;
	border: none;
	${props =>
		getHoverEffectOverride('white', props.theme.colors.secondary.main, '0.9')};

	&:disabled {
		opacity: 1;
		color: #c6c8c9;
	}
`;

const LightOutline = styled(Light)`
	color: white;
	border: 1px solid white;
	background: transparent;
	${props =>
		getHoverEffectOverride('white', props.theme.colors.secondary.main, '0.9')};

	&:disabled {
		opacity: 1;
		color: #c6c8c9;
	}
`;

const Plain = styled(ButtonBase)<{ hoverColor?: string; color?: string }>`
	color: ${props => props.color || props.theme.colors.text.main};
	height: auto;
	font-weight: ${props => normal(props)};
	border-radius: 0;
	${props =>
		getHoverEffectOverride(
			'none',
			props.hoverColor || props.theme.colors.text.light,
		)};
`;

const underlineButtonActiveStyles = (props: ThemedButtonProps) => `
	color: ${props.color || props.theme.colors.text.main};
	background: none;
	box-shadow: 0px -1px 0 0px inset;
`;

const Underline = styled(Plain)<{ active?: boolean; color?: string }>`
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
	{
		outline,
		underline,
		plain,
		active,
		light,
		...originalProps
	}: ThemedButtonProps,
	isPrimary: boolean,
) => {
	if (plain) {
		return (props: GrommetButtonProps) => (
			<Plain
				{...props}
				color={getColor(originalProps, 'color', 'main')}
				hoverColor={getColor(originalProps, 'color', 'light')}
			/>
		);
	}

	if (light) {
		if (outline) {
			return LightOutline;
		}
		return Light;
	}

	if (underline) {
		return (props: GrommetButtonProps) => (
			<Underline
				{...props}
				plain={true}
				color={getColor(originalProps, 'color', 'main')}
			/>
		);
	}

	if ((outline && !active) || !isPrimary) {
		return (props: GrommetButtonProps) => (
			<Outline {...props} color={getColor(originalProps, 'color', 'main')} />
		);
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
		light,
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

	// Set default to 'secondary'
	const secondary = baseColor ? false : true;
	baseColor = baseColor || props.theme.colors.secondary.main;

	// If the button is active, invert the background and text colors
	if (active) {
		basePrimary = !basePrimary;
	}

	const StyledButton = getStyledButton({ secondary, ...props }, basePrimary);

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
	light?: boolean;
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
