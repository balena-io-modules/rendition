import Color from 'color';
import { JSONSchema6 } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { DefaultProps, Theme } from '../common-types';

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

interface ThemedDefaultProps extends DefaultProps {
	theme: Theme;
}

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

export const fade = (color: string) =>
	Color(color)
		.fade(0.95)
		.string();

export const blacken = (color: string) =>
	Color(color)
		.darken(0.6)
		.string();

export const normal = (props: ThemedDefaultProps) =>
	get(props.theme, 'weights.0');
export const bold = (props: ThemedDefaultProps) =>
	get(props.theme, 'weights.1');

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

export const stopPropagation = <T>(e: Event | React.MouseEvent<T>) => {
	e.stopPropagation();
};

export const stopEvent = <T>(e: Event | React.MouseEvent<T>) => {
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
		const color = getColorFromTheme(props.theme)(type);
		if (isObject(color)) {
			return color[shade];
		} else {
			// We checked that this is not an object color, so we can ignore the typescript error
			// @ts-ignore
			return shadeCustomColor(color, shade);
		}
	}
};

const shadeCustomColor = (color: string, shade: 'main' | 'light' | 'dark') => {
	if (shade === 'main') {
		return color;
	}

	if (shade === 'light') {
		return lighten(color);
	}

	return darken(color);
};

export const monospace = (props: { monospace?: boolean; theme: Theme }) =>
	props.monospace ? `font-family: ${props.theme.monospace}` : null;

export const emphasized = (props: { emphasized?: boolean; theme: Theme }) =>
	`height: ${px(
		props.emphasized ? props.theme.space[5] : props.theme.space[4],
	)}`;

export const regexEscape = (str: string) =>
	str.replace(matchOperatorsRe, '\\$&');

/**
 * @name stripSchemaFormats
 * @summary Remove "format" keywords with an unknown value from a JSON schema
 * @function
 * @public
 *
 * @description @summary Remove any "format" keyword that has an unknown value
 * from a JSON schema. Optionally you can provide a whitelist of  formats that
 * should be preserved.
 *
 * @param {Object} schema - The json schema to filter
 * @param {String[]} [whitelist=[]] - An array of formats to preserver
 *
 * @returns {Object} A new schema object
 *
 * @example
 * const schema = {
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 			format: 'uuid'
 * 		},
 * 		bar: {
 * 			type: 'string',
 * 			format: 'email'
 * 		}
 * }
 *
 * const cleanSchema = utils.stripSchemaFormats(schema, [ 'email' ])
 * console.log(cleanSchema) // -->
 * {
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		},
 * 		bar: {
 * 			type: 'string',
 * 			format: 'email'
 * 		}
 * }
 */
export const stripSchemaFormats = (
	schema: JSONSchema6,
	whitelist: string[] = [],
) => {
	const newSchema = cloneDeep(schema);

	const _strip = (schema: JSONSchema6) => {
		if (schema.format && whitelist.indexOf(schema.format) === -1) {
			delete schema.format;
		}
		if (schema.properties) {
			forEach(schema.properties, subSchema => {
				_strip(subSchema as JSONSchema6);
			});
		}
		if (schema.items) {
			_strip(schema.items as JSONSchema6);
		}
	};

	_strip(newSchema);

	return newSchema;
};

/**
 * @name disallowAdditionalProperties
 * @summary Sets the "additionalProperties" keyword to false in a JSON schema
 * @function
 * @public
 *
 * @description Sets the "additionalProperties" keyword to false in a JSON schema
 *
 * @param {Object} schema - The json schema to filter
 *
 * @returns {Object} A new schema object
 *
 * @example
 * const schema = {
 * 	additionalProperties: true,
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		}
 * }
 *
 * const newSchema = utils.disallowAdditionalProperties(schema)
 * console.log(newSchema) // -->
 * {
 * 	additionalProperties: true,
 * 	type: 'object',
 * 	properties: {
 * 		foo: {
 * 			type: 'string',
 * 		}
 * }
 */
export const disallowAdditionalProperties = (schema: JSONSchema6) => {
	const newSchema = cloneDeep(schema);

	const disallow = (schema: JSONSchema6) => {
		if (schema.additionalProperties) {
			schema.additionalProperties = false;
		}
		if (schema.properties) {
			forEach(schema.properties, subSchema => {
				disallow(subSchema as JSONSchema6);
			});
		}
	};

	disallow(newSchema);

	return newSchema;
};

/**
 * @name getAngleBetweenPoints
 * @summary Gets the angle in degrees between two points, represented by objects
 * with x and y values.
 * @function
 * @public
 *
 * @param {Object} p1 - The first point object
 * @param {Object} p2 - The second point object
 *
 * @returns {Number} The angle in degrees
 */
type Point = { x: number; y: number };

export const getAngleBetweenPoints = (p1: Point, p2: Point) => {
	return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
};

/**
 * @name constrainNumber
 * @summary Constrains a number between an upper and lower bound
 * @function
 * @public
 *
 * @param {Number} value - The number to constrain
 * @param {Number=0} lower - The lower bound
 * @param {Number=100} upper - The upper bound
 *
 * @returns {Number} The constrained number
 */
export const constrainNumber = (
	value: number,
	lower: number = 0,
	upper: number = 100,
) => {
	return Math.min(Math.max(value, lower), upper);
};
