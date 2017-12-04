import * as React from 'react';
import styled, { StyledFunction, withTheme } from 'styled-components';
import hoc from '../hoc';
import { normal, bold, darken, getColor, getColoringType, px } from '../utils';

interface ButtonProps extends DefaultProps, Coloring, Sizing {
	square?: boolean;
	disabled?: boolean;
	outline?: boolean;
	plaintext?: boolean;
	underline?: boolean;
}

const squareWidth = (val: number): number => val / 9 * 10;

const minWidth = (props: ButtonProps) => {
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

const styleableButton: StyledFunction<ButtonProps> = styled.button;

const Button = styleableButton`
	padding-top: 1px;
	padding-left: ${props => px(horizontalPadding(props))};
	padding-right: ${props => px(horizontalPadding(props))};
	font-family: inherit;
	display: inline-block;
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
	height: ${(props: ButtonProps) =>
		px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};

	&:hover,
	&:focus,
	&:active {
		color: #fff;
		background-color: ${props =>
			getColor(props, 'bg', 'dark') || darken(props.color as string)};
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
`

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
	hoc(({ outline, underline, plaintext, ...props }: ButtonProps) => {
		if (plaintext) {
			return <Plaintext {...props} />;
		} else if (outline) {
			return <Outline {...props} />;
		} else if (underline) {
			return <Underline {...props} />;
		} else if (!getColoringType(props) && !props.color && !props.bg) {
			// outline tertiary is our default btn
			return <Outline {...props} tertiary />;
		} else {
			return <Button {...props} />;
		}
	}),
);
