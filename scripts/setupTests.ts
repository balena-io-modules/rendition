// tslint:disable-next-line:no-var-requires
const Enzyme = require('enzyme');
// tslint:disable-next-line:no-var-requires
const Adapter = require('enzyme-adapter-react-16');
// tslint:disable-next-line:no-var-requires
const { JSDOM } = require('jsdom');

Enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window: $window } = jsdom;

function copyProps(src: string, target: Record<string, any>) {
	Object.entries(Object.getOwnPropertyDescriptors(src)).forEach(
		([key, descriptor]) => {
			if (!target.hasOwnProperty(key)) {
				Object.defineProperty(target, key, descriptor);
			}
		},
	);
}

global.window = $window;
global.document = $window.document;

// See https://github.com/jsdom/jsdom/issues/3002 why we need to mock this.
global.document.createRange = () => {
	const range = new Range();

	range.getBoundingClientRect = jest.fn();

	range.getClientRects = () => {
		return {
			item: () => null,
			length: 0,
			[Symbol.iterator]: jest.fn(),
		};
	};

	return range;
};

// @ts-expect-error
global.navigator = {
	userAgent: 'node.js',
};
// @ts-expect-error
global.requestAnimationFrame = function (callback) {
	return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
	clearTimeout(id);
};
// @ts-expect-error
global.fetch = jest.fn(() => Promise.resolve());
copyProps($window, global);
