import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JSDOM } from 'jsdom';

Enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window: $window } = jsdom;

function copyProps(src: object, target: Record<string, any>) {
	Object.entries(Object.getOwnPropertyDescriptors(src)).forEach(
		([key, descriptor]) => {
			if (!target.hasOwnProperty(key)) {
				Object.defineProperty(target, key, descriptor);
			}
		},
	);
}

// @ts-expect-error
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
global.requestAnimationFrame = function (callback) {
	// @ts-expect-error This should have been using the browser typings.
	return setTimeout(callback, 0) as number;
};
global.cancelAnimationFrame = function (id) {
	clearTimeout(id);
};
// @ts-expect-error
global.fetch = jest.fn(() => Promise.resolve());
copyProps($window, global);
