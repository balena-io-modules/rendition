import * as Color from 'color';
import find = require('lodash/find');
import get = require('lodash/get');
import isObject = require('lodash/isObject');

interface ThemedDefaultProps extends DefaultProps {
	theme: Theme;
}

export const lighten = (color: string) =>
	Color(color)
		.fade(0.3)
		.string();

export const darken = (color: string) =>
	Color(color)
		.darken(0.2)
		.string();

export const fade = (color: string) =>
	Color(color)
		.fade(0.95)
		.string();

export const blacken = (color: string) =>
	Color(color)
		.darken(0.6)
		.string();

export const normal = (props: ThemedDefaultProps) => get(props.theme, 'weights.0');
export const bold = (props: ThemedDefaultProps) => get(props.theme, 'weights.1');

export const px = (n: any) => (typeof n === 'number' ? n + 'px' : n);

export const randomString = (length = 16) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

export const stopEvent = (e: Event) => {
	e.preventDefault();
	e.stopPropagation();
};

export const getColorFromTheme = (theme: Theme) => (
	colorString: string,
): {
	main: string;
	light?: string;
	dark?: string;
} => {
	// allows for dot notation like 'secondary.dark'
	return get(theme, `colors.${colorString}`);
};

export const getColoringType = (
	props: DefaultProps & Coloring & { [key: string]: any },
): string | undefined => {
	// get primary, tertiary, secondary etc
	const type = find<string>(
		Object.keys(props),
		b => !!props[b] && !!find(Object.keys(props.theme.colors), k => k === b),
	);
	return type;
};

export const getColor = (
	props: ThemedDefaultProps & Coloring,
	key: string,
	shade: 'main' | 'light' | 'dark',
) => {
	if (get(props, key)) {
		return get(props, key);
	}
	const type = getColoringType(props);
	if (type) {
		const color = getColorFromTheme(props.theme)(type);
		if (isObject(color)) {
			return color[shade];
		} else {
			return color;
		}
	}
};

export const monospace = (props: { monospace?: boolean; theme: Theme }) =>
	props.monospace ? { fontFamily: props.theme.monospace } : null;
