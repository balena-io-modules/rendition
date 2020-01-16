import Color from 'color';
import ColorHash from 'color-hash';
import find from 'lodash/find';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import memoize from 'lodash/memoize';
import { Theme } from '../common-types';

const colorHash = new ColorHash();

const shadeCustomColor = (color: string, shade: 'main' | 'light' | 'dark') => {
	if (shade === 'main') {
		return color;
	}

	if (shade === 'light') {
		return lighten(color);
	}

	return darken(color);
};

export const generateColorFromString = memoize((text: string): string => {
	return colorHash.hex(text.replace(/\s/g, ''));
});

export const isLight = (color?: string) => {
	return Color(color).luminosity() > 0.65;
};

export const opaque = (color: string, opacity: number) =>
	new Color([...Color(color).array(), opacity]).string();

export const lighten = (color: string) =>
	Color(color)
		.fade(0.3)
		.string();

export const darken = (color: string) =>
	Color(color)
		.darken(0.2)
		.string();

export const getColoringType = (props: {
	theme: Theme;
	[key: string]: any;
}): string | undefined => {
	// get primary, tertiary, secondary etc
	const type = find<string>(
		Object.keys(props),
		(b: any) =>
			!!props[b] && !!find(Object.keys(props.theme.colors), k => k === b),
	);
	return type;
};

export const getColor = (
	props: { theme: Theme; [key: string]: any },
	key: string,
	shade: 'main' | 'light' | 'dark',
) => {
	if (get(props, key)) {
		return shadeCustomColor(get(props, key), shade);
	}

	const type = getColoringType(props);
	if (type) {
		const color = get(props.theme, `colors.${type}`) as Theme['colors']['key'];
		if (isObject(color)) {
			return color[shade];
		} else {
			// We checked that this is not an object color, so we can ignore the typescript error
			return shadeCustomColor(color, shade);
		}
	}
};
