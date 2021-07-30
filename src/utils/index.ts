import * as React from 'react';
export * from './colorUtils';
export * from './schemaUtils';
export * from './styledUtils';

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

export const diff = <T extends number | string | boolean>(a: T, b: T) => {
	if (a === b) {
		return 0;
	}
	return a > b ? 1 : -1;
};

export const hashCode = function (text: string, max: number): number {
	let hash = 0;
	for (let index = 0; index < text.length; index++) {
		// tslint:disable-next-line no-bitwise
		hash = text.charCodeAt(index) + ((hash << 5) - hash);
	}

	// tslint:disable-next-line no-bitwise
	return (hash >> (text.length * 8)) & max;
};

export const randomString = (length = 16) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

export const regexEscape = (str: string) =>
	str.replace(matchOperatorsRe, '\\$&');

export const withConditional = <TProps extends {}>(
	hoc: (Base: React.ForwardRefExoticComponent<TProps>) => any,
	fn: (props: TProps) => boolean,
) => {
	return (Base: React.ForwardRefExoticComponent<TProps>) => {
		const Wrapped = hoc(Base);

		return React.forwardRef<any, TProps>((props, ref) => {
			const Component = fn(props) ? Wrapped : Base;
			return React.createElement(Component, { ...props, ref });
		});
	};
};

export const stopEvent = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
	event.preventDefault();
	event.stopPropagation();
};

export const stopKeyDownEvent = (
	e: React.KeyboardEvent<HTMLElement>,
	keyCode: number,
	handler?: () => void,
) => {
	if (!e.defaultPrevented && e.keyCode === keyCode) {
		e.preventDefault();
		e.stopPropagation();
		if (handler) {
			handler();
		}
	}
};

export const withPreventDefault =
	(fn: () => unknown) => (e?: React.FormEvent<HTMLElement>) => {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		return fn();
	};

export const getFromLocalStorage = <T extends any>(
	key: string,
): T | undefined => {
	try {
		const val = localStorage.getItem(key);
		if (val != null) {
			return JSON.parse(val);
		}

		return undefined;
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

export const setToLocalStorage = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error(err);
	}
};

export const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error(err);
	}
};
