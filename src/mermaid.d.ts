declare module 'mermaid' {
	type BindFunctions = (element: HTMLElement) => void;

	interface MermaidAPI {
		parse(definition: string): boolean;
		render(
			id: string,
			definition: string,
			callback?: (svgCode: string, bindFunctions: BindFunctions) => void,
		): string;
	}

	export const mermaidAPI: MermaidAPI;
}
