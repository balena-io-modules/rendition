/* used multiple times below */
const primaryLight = '#5FB3E7';
const colors = {
	primary: {
		main: '#2297DE',
		light: primaryLight,
		dark: '#1E87C7',
	},
	secondary: {
		main: '#FFC523',
		light: '#FFD45E',
		dark: '#E5B01F',
	},
	tertiary: {
		main: '#4D5057',
		light: '#7E8085',
		dark: '#2F3033',
	},
	quartenary: {
		main: '#EBEFF4',
		light: '#F0F3F7',
		dark: '#D3D6DB',
	},

	danger: {
		main: '#FF4444',
		semilight: '#FFA1A1',
		light: '#FFECEC',
		dark: '#661B1B',
	},
	warning: {
		main: '#FCA321',
		semilight: '#FDD190',
		light: '#FEF5E9',
		dark: '#64410D',
	},
	success: {
		main: '#4DB313',
		semilight: '#A6D989',
		light: '#EDF7E7',
		dark: '#1E4707',
	},
	info: {
		main: '#2297DE',
		semilight: '#90CBEE',
		light: '#E9F4FB',
		dark: '#0D3C58',
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
		main: primaryLight,
	},
	statusPostProvisioning: {
		main: '#aa96d5',
	},
	statusOffline: {
		main: '#fd7c7c',
	},

	gray: {
		main: '#c6c8c9',
		light: '#f4f4f4',
		dark: '#9f9f9f',
	},
};

const defaultControlHeight = 36;
const emphasizedControlHeight = 48;

export const breakpoints = [32, 48, 64, 80];

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
export const font = `Roboto, Arial, sans-serif`;
export const monospace = `'Ubuntu Mono', 'Courier New', monospace`;

export default {
	breakpoints,
	space,
	fontSizes,
	weights,
	font,
	monospace,
	colors,
	radius,
};
