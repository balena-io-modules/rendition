import * as React from 'react';
import { ButtonProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { bold, darken, getColor, getColoringType, normal, px } from '../utils';

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
		return props.emphasized ? 50 : 20;
	}
	if (props.square || props.w) {
		return 0;
	}

	return props.emphasized ? 50 : 20;
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
	font-weight: ${props => bold(props)};
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

	&:hover,
	&:focus,
	&:active {
		color: ${props => props.color || '#fff'};
		background-color: ${props =>
			props.bg ? darken(props.bg as string) : getColor(props, 'bg', 'dark')};
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
	border: 1px solid;

	&:hover,
	&:focus,
	&:active {
		background-color: ${props =>
			props.bg
				? darken(props.bg as string)
				: getColor(props, 'bg', 'dark') || props.theme.colors.tertiary.dark};
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
				// outline tertiary is our default btn
				return (
					<Outline {...props} tertiary>
						{iconElement && <ButtonIcon>{iconElement}</ButtonIcon>}
						{children}
					</Outline>
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
