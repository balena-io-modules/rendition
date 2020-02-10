// Custom typings for using the xtermjs fit addon as a standalone module
declare module 'xterm/dist/addons/fit/fit' {
	import * as Xterm from 'xterm';

	export function proposeGeometry(
		term: Xterm.Terminal,
	): null | { cols: number; rows: number };
	export function fit(term: Xterm.Terminal): void;
}
