import Color from 'color';
import ColorHash from 'color-hash';
import find from 'lodash/find';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import memoize from 'lodash/memoize';
import { Theme } from '../common-types';

const colorHash = new ColorHash();

const shadeCustomColor = (
	color: string,
	shade: 'main' | 'light' | 'dark' | 'emphasized' | 'de_emphasized',
) => {
	if (shade === 'main') {
		return color;
	}

	if (shade === 'light') {
		return lighten(color);
	}

	return darken(color);
};

const parseColor = (value: any, mix = value) => {
	const emphasized = Color(value).darken(0.4).mix(Color(mix), 0.1).hex();
	const main = Color(value).hex();
	let de_emphasized = Color(value)
		.mix(Color(mix), 0.3)
		.lighten(0.4)
		.desaturate(0.6)
		.hex();

	if (Color(main).contrast(Color(de_emphasized)) <= 1) {
		de_emphasized = Color(value)
			.mix(Color(mix), 0.3)
			.darken(0.1)
			.desaturate(0.6)
			.hex();
	}

	return {
		emphasized,
		main,
		de_emphasized,
	};
};

export const generateColors = (base: {
	background: string;
	text: string;
	primary: string;
	secondary: string;
	danger: string;
	warning: string;
	success: string;
	info: string;
}) => {
	// States: hover, focus, disabled
	// Variation: emphasized, de-emphasized
	const theme: any = {};

	forEach(base, (value, key) => {
		if (key === 'background') {
			return (theme[key] = parseColor(value, base.primary));
		}
		return (theme[key] = parseColor(value));
	});

	return theme;
};

// Returns a color that is legible if put on the passed background.
export const getLegibleTextColor = memoize((bg: string, contrast = 4.5) => {
	const bgColor = new Color(bg);
	const findWithContrast = (darken: number): string => {
		// Darkening goes from 0 to 1. This makes sure the recursive function terminates.
		if (darken >= 1) {
			return bgColor.darken(1).hex();
		}

		const textColor = bgColor.darken(darken);
		if (textColor.contrast(bgColor) >= contrast) {
			return textColor.hex();
		}

		// We can do divide-and-conquer strategy here, but this is simpler and still guaranteed to finish in < 20 iterations.
		return findWithContrast(darken + 0.05);
	};

	// It is pointless to start with 0, so we start with some trivially larger value
	return findWithContrast(0.1);
});

export const generateColorFromString = memoize((text: string): string => {
	return colorHash.hex(text.replace(/\s/g, ''));
});

export const isLight = (color?: string) => {
	return Color(color).luminosity() > 0.65;
};

export const opaque = (color: string, opacity: number) =>
	new Color([...Color(color).array(), opacity]).string();

export const lighten = (color: string) => Color(color).fade(0.3).string();

export const darken = (color: string, amount?: number) =>
	Color(color)
		.darken(amount || 0.2)
		.string();

export const getColoringType = (props: {
	theme: Theme;
	[key: string]: any;
}): string | undefined => {
	// get primary, tertiary, secondary etc
	const type = find<string>(
		Object.keys(props),
		(b: any) =>
			!!props[b] && !!find(Object.keys(props.theme.colors), (k) => k === b),
	);
	return type;
};

export const getColor = (
	props: { theme: Theme; [key: string]: any },
	key: string,
	shade: 'main' | 'emphasized' | 'de_emphasized',
) => {
	if (get(props, key)) {
		return shadeCustomColor(get(props, key), shade);
	}

	const type = getColoringType(props);
	if (type) {
		const color = get(props.theme, `colors.${type}`) as Theme['colors']['key'];
		if (color != null && typeof color === 'object') {
			return color[shade];
		} else {
			// We checked that this is not an object color, so we can ignore the typescript error
			return shadeCustomColor(color, shade);
		}
	}

	return 'red'; // default return value
};
