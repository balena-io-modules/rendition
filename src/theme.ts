import { px } from 'styled-system';
import { Omit } from './common-types';
import { generateColors } from './utils/colorUtils';

interface ColorVariants {
	main: string;
	emphasized: string;
	de_emphasized: string;
	light?: string;
	dark?: string;
	semilight?: string;
}

const baseLight = {
	background: '#ffffff',
	text: '#2a506f',
	primary: '#00aeef',
	secondary: '#efd700',
	danger: '#d32f2f',
	warning: '#fca321',
	success: '#1ac135',
	info: '#1496e1',
};

const baseDark = {
	background: '#282C34',
	text: '#F0F0F0',
	primary: '#7B69C0',
	secondary: '#8fb86a',
	danger: '#d32f2f',
	warning: '#fca321',
	success: '#1ac135',
	info: '#1496e1',
};

export const colorsLight = generateColors(baseLight);
export const colorsDark = generateColors(baseDark);

const defaultControlHeight = 38;
const emphasizedControlHeight = 48;

export const breakpoints = [576, 768, 992, 1200];

export const space = [
	0,
	4,
	8,
	16,
	defaultControlHeight,
	emphasizedControlHeight,
	128,
];

export const fontSizes = [10, 12, 14, 16, 18, 24, 34, 58, 72];
export const weights = [400, 600];

export const radius = 3;

export const font = `'Source Sans Pro', Helvetica, sans-serif`;
export const monospace = `'Ubuntu Mono', 'Courier New', monospace`;
export const lineHeight = 1.5;

export const header = {
	height: '0',
};

export const generateTheme = (colors: {
	background: ColorVariants;
	text: ColorVariants;
	primary: ColorVariants;
	secondary: ColorVariants;
	info: ColorVariants;
	success: ColorVariants;
	warning: ColorVariants;
	danger: ColorVariants;

	// old
	gray: ColorVariants;
}) => {
	console.log('genColors', colors);

	return {
		breakpoints,
		space,
		fontSizes,
		weights,
		font,
		monospace,
		lineHeight,
		colors,
		radius,
		header,
		global: {
			font: {
				family: font,
				size: px(fontSizes[2]),
				height: lineHeight,
			},
			control: {
				disabled: {
					opacity: 0.4,
				},
				border: {
					radius: '4px',
					color: colors.background.de_emphasized,
				},
			},
			colors: {
				focus: colors.primary.main,
				placeholder: colors.secondary.de_emphasized,
			},
			selected: {
				background: colors.primary.main,
			},
			hover: {
				background: {
					color: colors.background.de_emphasized,
					opacity: 1,
				},

				color: {
					dark: 'inherit',
					light: 'inherit',
				},
			},
			active: {
				background: {
					color: colors.background.de_emphasized,
					opacity: 1,
				},

				color: {
					dark: 'inherit',
					light: 'inherit',
				},
			},
			drop: {
				border: {
					radius: '4px',
				},
				zIndex: 45,
				// TODO: Border color should be background.emphasized once the TODOs in the Select component are resolved.
				extend: `
				color: ${colors.secondary.main}; border: 1px solid ${colors.background.de_emphasized};
				animation-duration: 0s;
			`,
			},
			input: {
				weight: 400 as string | number,
			},
		},
		button: {
			height: '38px',
			font: {
				weight: 600 as string | number,
				size: px(fontSizes[2]),
			},
			border: {
				width: '1px',
				radius: '20px',
				color: colors.text.main,
			},
			padding: {
				horizontal: '30px',
			},
		},
		navBar: {
			font: {
				size: px(fontSizes[2]),
			},
		},
		radioButton: {
			border: {
				width: '1px',
				color: {
					dark: colors.background.de_emphasized,
					light: colors.background.de_emphasized,
				},
			},
			hover: {
				border: {
					color: {
						dark: colors.background.emphasized,
						light: colors.background.emphasized,
					},
				},
			},
			check: {
				color: {
					dark: 'white',
					light: 'white',
				},
			},
			// This actually sets the circle diameter to 6px;
			icon: { size: '12px' },
			gap: '10px',
			size: '20px',
		},
		select: {
			icons: {
				color: colors.secondary.main,
			},
			control: {
				extend: `color: ${colors.secondary.main}`,
			},
		},
		layer: {
			container: {
				zIndex: 40,
			},
			zIndex: 30,
		},
		text: {
			medium: {
				size: px(fontSizes[2]),
				height: lineHeight,
			},
		},
		tab: {
			extend: `padding: ${px(space[1])} ${px(space[3])}`,
			color: colors.secondary.main,
			margin: 'none',
			border: {
				size: 'xsmall',
				color: colors.background.de_emphasized,
				active: {
					color: colors.primary.main,
				},
				hover: {
					color: colors.background.de_emphasized,
				},
			},
			hover: {
				color: colors.primary.emphasized,
			},
			active: {
				color: colors.primary.main,
			},
		},
		checkBox: {
			size: '20px',
			color: colors.primary.main,
			border: {
				color: {
					dark: colors.background.de_emphasized,
					light: colors.background.de_emphasized,
				},
				width: '1px',
			},
			check: {
				radius: '4px',
				thickness: '2px',
			},
			hover: {
				border: {
					color: {
						dark: colors.background.de_emphasized,
						light: colors.background.de_emphasized,
					},
				},
			},
			toggle: {
				color: {
					dark: colors.primary.main,
					light: colors.background.de_emphasized,
				},
				radius: '20px',
				size: '40px',
				knob: {},
			},
		},
		accordion: {
			border: {
				side: 'bottom',
			},
		},
	};
};

const theme = generateTheme(colorsLight);

export default theme;

export interface Theme extends Omit<typeof theme, 'colors'> {
	header: {
		height: string;
	};
	colors: Record<string, ColorVariants>;
}
