import * as Color from 'color';
import { JSONSchema6 } from 'json-schema';
import cloneDeep = require('lodash/cloneDeep');
import find = require('lodash/find');
import forEach = require('lodash/forEach');
import get = require('lodash/get');
import isObject = require('lodash/isObject');
import { ThemedStyledFunction } from 'styled-components';
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

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
		b => !!props[b] && !!find(Object.keys(props.theme.colors), k => k === b),
	);
	return type;
};

export const getColor = (
	props: { theme: Theme; [key: string]: any },
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

// TODO: replace the method call with a simple interface
// utilizing `infer`, once TS 2.8 is out
export function withProps<U>() {
	return <P, T, O>(
		fn: ThemedStyledFunction<P, T, O>,
	): ThemedStyledFunction<P & U, T, O & U> => fn;
}

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
	};

	_strip(newSchema);

	return newSchema;
};
