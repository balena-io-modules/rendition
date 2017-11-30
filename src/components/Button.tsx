import find = require('lodash/find');
import get = require('lodash/get');
import isObject = require('lodash/isObject');
import * as React from 'react';
import styled, { StyledFunction, withTheme } from 'styled-components';
import hoc from '../hoc';
import { bold, darken, px } from '../utils';

interface ButtonProps extends DefaultProps, Coloring, Sizing {
	square?: boolean;
	disabled?: boolean;
	outline?: boolean;
	underline?: boolean;
}

const getColorFromTheme = (theme: Theme) => (
	colorString: string,
): {
	main: string;
	light?: string;
	dark?: string;
} => {
	// allows for dot notation like 'secondary.dark'
	return get(theme, `colors.${colorString}`);
};

const getType = (props: ButtonProps): string | undefined => {
	// get primary, tertiary, secondary etc
	const type = find<string>(
		Object.keys(props),
		b => !!find(Object.keys(props.theme.colors), k => k === b),
	);
	return type;
};

const getColor = (
	props: ButtonProps,
	key: string,
	shade: 'main' | 'light' | 'dark',
) => {
	if (get(props, key)) {
		return get(props, key);
	}
	const type = getType(props);
	if (type) {
		const color = getColorFromTheme(props.theme)(type);
		if (isObject(color)) {
			return color[shade];
		} else {
			return color;
		}
	}
};

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

const Underline = Outline.extend`
	border: 0;
	border-radius: 0;
	border-bottom: 1px solid;

	&:hover,
	&:focus,
	&:active {
		background: none;
		color: ${props =>
			getColor(props, 'color', 'main') || props.theme.colors.text.main};
		box-shadow: 0px -1px 0 0px inset;
	}
`;

export default withTheme(
	hoc(({ outline, underline, ...props }: ButtonProps) => {
		if (outline) {
			return <Outline {...props} />;
		} else if (underline) {
			return <Underline {...props} />;
		} else if (!getType(props) && !props.color && !props.bg) {
			// outline tertiary is our default btn
			return <Outline {...props} tertiary />;
		} else {
			return <Button {...props} />;
		}
	}),
);
