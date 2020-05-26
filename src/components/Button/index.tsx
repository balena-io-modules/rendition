import { Button, ButtonProps as GrommetButtonProps } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';
import asRendition from '../../asRendition';
import {
	Coloring,
	DefaultProps,
	RenditionSystemProps,
	ResponsiveStyle,
	Sizing,
	Theme,
} from '../../common-types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { getColor, getColoringType, isLight, px } from '../../utils';

const getHoverEffectOverride = (
	bg: string | undefined,
	color: string,
	opacity?: string,
) => {
	return css`
		&:hover:enabled,
		&:focus:enabled,
		&:active:enabled {
			svg {
				color: ${color} !important;
			}

			box-shadow: none;
			background: ${bg};
			border-color: ${bg};
			color: ${color};
			opacity: ${opacity ?? 'initial'};
		}
	`;
};

/* Using '&' to add an extra layer of specificity and make sure
the rendition styles override the Grommet global ones.
https://www.styled-components.com/docs/advanced#issues-with-specificity
*/
const ButtonBase = styled(Button)`
	& {
		font-family: ${(props) => props.theme.titleFont};
		font-weight: ${(props) => props.theme.button.font.weight};
		font-size: ${(props) => px(props.theme.fontSizes[1])};
		height: ${(props) => props.theme.button.height};
		white-space: nowrap;
		svg {
			color: inherit !important;
			font-size: 0.925em;
		}
		/* These rules cause consistent styling when the button is rendered as a link */
		display: inline-flex;
		align-items: center;
		justify-content: center;

		&:disabled {
			cursor: not-allowed;
		}
	}
`;

const ColouredButton = styled(ButtonBase)`
	& {
		color: ${(props) =>
			isLight(getColor(props, 'color', 'main'))
				? props.theme.colors.text.main
				: 'white'};
		${(props) => {
			const color = getColor(props, 'color', 'dark');
			return getHoverEffectOverride(
				color,
				isLight(color) ? props.theme.colors.text.main : 'white',
			);
		}};
	}
`;

const Outline = styled(ButtonBase)`
	& {
		color: ${(props) => props.theme.colors.text.main};
		border-color: ${(props) =>
			getColor(props, 'color', 'main') || props.theme.colors.text.main};
		svg {
			color: ${(props) => props.theme.colors.tertiary.main} !important;
		}
		${(props) =>
			getHoverEffectOverride(
				props.color || props.theme.colors.text.main,
				isLight(getColor(props, 'color', 'main'))
					? props.theme.colors.text.main
					: 'white',
			)};
	}
`;

const Light = styled(ButtonBase)`
	& {
		color: ${(props) => props.theme.colors.text.main};
		border-color: ${(props) => props.theme.colors.text.main};
		background: white;
		border: none;
		${(props) =>
			getHoverEffectOverride(
				'white',
				props.theme.colors.secondary.main,
				'0.9',
			)};

		&:disabled {
			opacity: 1;
			color: #c6c8c9;
		}
	}
`;

const LightOutline = styled(Light)`
	& {
		color: white;
		border: 1px solid white;
		background: transparent;
		${(props) =>
			getHoverEffectOverride(
				'white',
				props.theme.colors.secondary.main,
				'0.9',
			)};

		&:disabled {
			opacity: 1;
			color: #c6c8c9;
		}
	}
`;

const Plain = styled(ButtonBase)`
	& {
		color: ${(props) =>
			getColor(props, 'color', 'main') || props.theme.colors.text.main};
		height: auto;
		font-weight: ${(props) => props.theme.button.font.weight};
		border-radius: 0;
		${(props) =>
			getHoverEffectOverride(
				'none',
				getColor(props, 'color', 'dark') || props.theme.colors.text.light,
			)};
	}
`;

const underlineButtonActiveStyles = (props: { theme: Theme }) => css`
	& {
		color: ${getColor(props, 'color', 'main') || props.theme.colors.text.main};
		background: none;
		box-shadow: 0px -1px 0 0px inset;
	}
`;

const Underline = styled(Plain)<{ active?: boolean; color?: string }>`
	& {
		${(props) => (props.active ? underlineButtonActiveStyles(props) : '')}
		border-bottom: 1px solid;
		background: none;
		&:hover:enabled,
		&:focus:enabled,
		&:active:enabled {
			${underlineButtonActiveStyles};
		}
	}
`;

const getStyledButton = (
	{ outline, underline, plain, active, light }: ThemedButtonProps,
	isPrimary: boolean,
) => {
	if (plain) {
		return Plain;
	}
	if (light) {
		if (outline) {
			return LightOutline;
		}
		return Light;
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
		light,
		compact,
		...restProps
	} = props;

	// Add a method to hide the button label. Here we can just pass an array of
	// boolean to decide on each breakpoint whether to show the label or not
	const shouldCompact = useBreakpoint(compact || [false]);

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
			gap={px(props.theme.space[2])}
			{...restProps}
			plain={!!plain || !!underline}
			label={shouldCompact ? undefined : label || children}
		/>
	);
};

interface ButtonBaseProps extends Coloring, Sizing {
	width?: ResponsiveStyle;
	bg?: string;
	outline?: boolean;
	underline?: boolean;
	light?: boolean;
	compact?: boolean[];
}

export interface InternalButtonProps
	extends ButtonBaseProps,
		Omit<DefaultProps, 'dir'>,
		GrommetButtonProps {
	type?: 'submit' | 'reset' | 'button';
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
