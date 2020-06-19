export * from './colorUtils';
export * from './schemaUtils';
export * from './styledUtils';
export * from './urlUtils';

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

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
