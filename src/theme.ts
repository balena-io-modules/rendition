import * as Color from 'color';

const darken = (percent: number, color: string) =>
	Color(color)
		.darken(percent)
		.hex();

const lighten = (percent: number, color: string) =>
	Color(color)
		.lighten(percent)
		.hex();

const primary = '#00AEEF';
const secondary = '#2A506F';
const tertiary = '#527699';
const quartenary = '#F8F9FD';

const danger = '#FF423D';
const warning = '#FCA321';
const success = '#1AC135';
const info = '#1496E1';

const colors = {
	primary: {
		main: primary,
		light: lighten(0.1, primary),
		dark: darken(0.1, primary),
	},
	secondary: {
		main: secondary,
		light: lighten(0.1, secondary),
		dark: darken(0.1, secondary),
	},
	tertiary: {
		main: tertiary,
		light: lighten(0.1, tertiary),
		dark: darken(0.1, tertiary),
	},
	quartenary: {
		main: quartenary,
		light: lighten(0.1, quartenary),
		dark: darken(0.1, quartenary),
	},

	danger: {
		main: danger,
		semilight: lighten(0.2, danger),
		light: lighten(0.55, danger),
		dark: darken(0.2, danger),
	},
	warning: {
		main: warning,
		semilight: lighten(0.2, warning),
		light: lighten(0.7, warning),
		dark: darken(0.2, warning),
	},
	success: {
		main: success,
		semilight: lighten(0.22, success),
		light: lighten(1.25, success),
		dark: darken(0.2, success),
	},
	info: {
		main: info,
		semilight: lighten(0.27, info),
		light: lighten(1, info),
		dark: darken(0.2, info),
	},

	text: {
		main: '#3c3e42',
		light: '#8f9297',
		dark: '#1c1d1e',
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

const defaultControlHeight = 36;
const emphasizedControlHeight = 48;

export const breakpoints = ['32em', '48em', '64em', '80em'];

export const space = [
	0,
	4,
	8,
	16,
	defaultControlHeight,
	emphasizedControlHeight,
	128,
];

export const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 72, 96];

export const weights = [400, 700];

export const radius = 3;
export const font = `'Nunito', Arial, sans-serif`;
export const titleFont = `CircularStd, Arial, sans-serif`;
export const monospace = `'Ubuntu Mono', 'Courier New', monospace`;

export default {
	breakpoints,
	space,
	fontSizes,
	weights,
	font,
	titleFont,
	monospace,
	colors,
	radius,
	global: {
		font: {
			family: font,
			size: '14px',
			height: 1.5,
		},
		control: {
			disabled: {
				opacity: 0.4,
			},
			border: {
				radius: '20px',
			},
		},
		colors: {
			focus: '#73AAF5',
		},
	},
	button: {
		border: {
			width: '1px',
			radius: '20px',
			color: colors.text.main,
		},
		padding: {
			horizontal: '30px',
		},
	},
	text: {
		medium: {
			size: '14px',
			height: '1.5',
		},
	},
	tab: {
		extend: 'border: none;',
		color: colors.primary.main,
	},
};
