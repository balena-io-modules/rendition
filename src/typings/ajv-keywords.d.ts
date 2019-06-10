declare module 'ajv-keywords' {
	import ajv from 'ajv';
	function decorate(ajv: ajv.Ajv, words?: string[]): void;

	export = decorate;
}
