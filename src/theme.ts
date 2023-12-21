import { px } from 'styled-system';
import { Omit } from './common-types';

const primary = '#00AEEF';
const secondary = '#2A506F';
const tertiary = '#527699';
const quartenary = '#DDE1f0';

const danger = '#FF423D';
const warning = '#FCA321';
const success = '#1AC135';
const info = '#1496E1';

interface ColorVariants {
	main: string;
	light?: string;
	dark?: string;
	semilight?: string;
}

const colors = {
	primary: {
		main: primary,
		semilight: '#aedff9',
		light: '#08bcff',
		dark: '#009dd7',
	},
	secondary: {
		main: secondary,
		semilight: '#abb9c5',
		light: '#2e587a',
		dark: '#23445e',
	},
	tertiary: {
		main: tertiary,
		semilight: '#bbc8d6',
		light: '#5b82a7',
		dark: '#456482',
	},
	quartenary: {
		main: quartenary,
		semilight: '#f2f4fa',
		light: '#f8f9fd',
		dark: '#b7bed3',
	},

	danger: {
		main: danger,
		semilight: '#ffa1a1',
		light: '#feebeb',
		dark: '#eb0800',
	},
	warning: {
		main: warning,
		semilight: '#fdd190',
		light: '#fef3e5',
		dark: '#ad6800',
	},
	success: {
		main: success,
		semilight: '#8ce09a',
		light: '#e8f8ea',
		dark: '#138b27',
	},
	info: {
		main: info,
		semilight: '#90cbee',
		light: '#e8f5fc',
		dark: '#107dbc',
	},

	text: {
		main: '#2A506F',
		light: '#527699',
		dark: '#23445e',
	},

	statusIdle: {
		main: '#89c683',
	},
	statusConfiguring: {
		main: '#ffb25e',
	},
	statusUpdating: {
		main: '#75C5F5',
	},
	statusPostProvisioning: {
		main: '#aa96d5',
	},
	statusOffline: {
		main: '#fd7c7c',
	},
	statusInactive: {
		main: '#d3d6db',
	},

	gray: {
		main: '#c6c8c9',
		light: '#f4f4f4',
		dark: '#9f9f9f',
	},
};

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

export const font = 'Helvetica, sans-serif';
export const monospace = `'Ubuntu Mono', 'Courier New', monospace`;
export const lineHeight = 1.5;

export const header = {
	height: '0',
};

const theme = {
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
				color: colors.quartenary.main,
			},
		},
		colors: {
			focus: colors.primary.main,
			placeholder: colors.secondary.semilight,
		},
		selected: {
			background: colors.primary.main,
		},
		hover: {
			background: {
				color: colors.quartenary.main,
				opacity: 1,
			},

			color: {
				dark: 'inherit',
				light: 'inherit',
			},
		},
		active: {
			background: {
				color: colors.quartenary.main,
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
			// TODO: Border color should be tertiary.main once the TODOs in the Select component are resolved.
			extend: `
				color: ${colors.secondary.main}; border: 1px solid ${colors.quartenary.main};
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
				dark: colors.quartenary.main,
				light: colors.quartenary.main,
			},
		},
		hover: {
			border: {
				color: {
					dark: colors.tertiary.main,
					light: colors.tertiary.main,
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
			zIndex: 5000,
		},
		zIndex: 4999,
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
			color: colors.quartenary.main,
			active: {
				color: colors.primary.main,
			},
			hover: {
				color: colors.quartenary.main,
			},
		},
		hover: {
			color: colors.primary.dark,
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
				dark: colors.quartenary.main,
				light: colors.quartenary.main,
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
					dark: colors.quartenary.main,
					light: colors.quartenary.main,
				},
			},
		},
		toggle: {
			color: {
				dark: colors.primary.main,
				light: colors.quartenary.main,
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
	rating: {
		star: {
			color: {
				full: colors.warning.main,
				empty: colors.quartenary.main,
			},
		},
	},
};

export default theme;

export interface Theme extends Omit<typeof theme, 'colors'> {
	header: {
		height: string;
	};
	colors: Record<string, ColorVariants>;
}
