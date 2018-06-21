import * as React from 'react';
import { ButtonProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import {
	bold,
	darken,
	getColor,
	getColoringType,
	lighten,
	normal,
	px,
} from '../utils';

interface ThemedButtonProps extends ButtonProps {
	theme: Theme;
}

const squareWidth = (val: number): number => val / 9 * 10;

const minWidth = (props: ThemedButtonProps) => {
	if (props.w == null && !props.square) {
		return 'auto';
	}
	if (props.square) {
		return props.emphasized
			? squareWidth(props.theme.space[5])
			: squareWidth(props.theme.space[4]);
	}

	return props.w;
};

const horizontalPadding = (props: ButtonProps) => {
	if (props.w == null && !props.square) {
		return props.emphasized ? 50 : 30;
	}
	if (props.square || props.w) {
		return 0;
	}

	return props.emphasized ? 50 : 30;
};

const ButtonIcon = styled.span`
	margin-right: ${props => px(props.theme.space[2])};
	font-size: 0.875em;
`;

const Button = (styled.button as StyledFunction<ThemedButtonProps>)`
	padding: 0 ${props => px(horizontalPadding(props))};
	font-family: inherit;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: ${props => normal(props)};
	border-radius: ${props => px(props.theme.radius)};
	appearance: none;
	text-decoration: none;
	border: 0;
	margin: 0;
	min-width: ${props => px(minWidth(props))};
	vertical-align: middle;
	font-size: inherit;
	line-height: 1.1;
	text-align: center;
	cursor: pointer;
	background: ${props => props.bg || getColor(props, 'bg', 'main')};
	color: ${props => props.color || '#fff'};
	height: ${(props: ThemedButtonProps) =>
		px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
	transition-property: color, background, border-color;
	transition-duration: .1s;
	transition-timing-function: ease-in;
	outline: none;

	&:hover {
		color: ${props => props.color || '#fff'};
			background-color: ${props =>
				props.bg
					? lighten(props.bg as string)
					: lighten(getColor(props, 'bg', 'main'))}
		}
	}
	&:active {
		color: ${props => props.color || '#fff'};
		background-color: ${props =>
			props.bg
				? darken(props.bg as string)
				: darken(getColor(props, 'bg', 'main'))}
		}

	&:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}
`;

const Outline = Button.extend`
	color: ${props =>
		getColor(props, 'color', 'main') || props.theme.colors.text.main};
	background: ${props => props.color || 'none'};
	border: 1px solid ${props =>
		props.bg ? props.bg : getColor(props, 'bg', 'main')}
	}
`;

const Plaintext = Button.extend`
	padding-left: 0;
	padding-right: 0;
	height: auto;
	border: 0;
	border-radius: 0;
	color: ${props =>
		getColor(props, 'color', 'main') || props.theme.colors.text.main};
	background: ${props => props.color || 'none'};
	font-weight: ${props => normal(props)};

	&:hover,
	&:focus,
	&:active {
		background: none;
		color: ${props =>
			getColor(props, 'color', 'dark') || props.theme.colors.text.main};
	}
`;

const Underline = Plaintext.extend`
	padding-bottom: 2px;
	border-bottom: 1px solid;
	font-weight: ${props => bold(props)};

	&:hover,
	&:focus,
	&:active {
		color: ${props =>
			getColor(props, 'color', 'main') || props.theme.colors.text.main};
		box-shadow: 0px -1px 0 0px inset;
	}
`;

const DefaultButton = Button.extend`
	background: #fff;
	color: ${props => props.theme.colors.text.main};
	border: 1px solid ${props => props.theme.colors.gray.main};
	&:hover {
		background: #fff;
		color: ${props => props.theme.colors.text.main};
		border-color: ${props => props.theme.colors.text.main};
	}
	&:active {
		color: #fff;
		background-color: ${props => props.theme.colors.text.main};
	}
`;

export default withTheme(
	asRendition(
		({
			outline,
			underline,
			plaintext,
			children,
			iconElement,
			...props
		}: ThemedButtonProps) => {
			if (plaintext) {
				return (
					<Plaintext {...props}>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</Plaintext>
				);
			} else if (outline) {
				return (
					<Outline {...props}>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</Outline>
				);
			} else if (underline) {
				return (
					<Underline {...props}>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</Underline>
				);
			} else if (!getColoringType(props) && !props.color && !props.bg) {
				return (
					<DefaultButton {...props}>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</DefaultButton>
				);
			} else {
				return (
					<Button {...props}>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</Button>
				);
			}
		},
	),
) as React.ComponentClass<ButtonProps>;
