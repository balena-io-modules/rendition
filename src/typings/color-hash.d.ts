declare module 'color-hash' {
	interface Hasher {
		hex(text: string): string;
	}

	class ColorHash {
		public hex(text: string): string;
		public rgb(text: string): [number, number, number];
	}

	export = ColorHash;
}
