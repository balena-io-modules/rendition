declare module 'styled-system' {
	export function color(props: any): string;
	export function fontSize(props: any): string;
	export function space(props: any): string;
	export function width(props: any): string;
	export function responsiveStyle(
		_props: any,
		props: any,
	): (props: any) => string;
	export function textAlign(props: any): string;
}
