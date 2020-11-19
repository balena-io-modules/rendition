import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider, useTheme } from '../';
import { useBreakpoint } from './useBreakpoint';
import { breakpoints } from '../theme';

const Sample = () => {
	const theme = useTheme();

	return <span>{theme.font}</span>;
};

test('useTheme should return correct theme object', () => {
	const theme = {
		font: 'Arial',
	};

	const component = mount(
		<Provider theme={theme}>
			<Sample />
		</Provider>,
	);
	const text = component.find(Sample).text();
	expect(text).toEqual('Arial');
});

const resizeWindow = (width = 600) => {
	// @ts-ignore
	global.window.innerWidth = width;
	global.window.dispatchEvent(new Event('resize'));
};

const HookContainer = ({ children, values }: any) =>
	children(useBreakpoint(values));

const testHook = (values: any) => {
	let retrunValues;
	mount(
		<Provider>
			<HookContainer values={values}>
				{(hookVal: any) => {
					retrunValues = hookVal;
					return null;
				}}
			</HookContainer>
		</Provider>,
	);
	return retrunValues;
};

describe('should test useBreakpoint hook in multiple resolutions', () => {
	const values = breakpoints.map((b) => `less than ${b}`);
	const table = breakpoints.map((b, index) => [`name: ${b}`, b, values[index]]);
	test.each(table)(
		'useBreakpoint should return %s value with %d resolution',
		(_name: any, resolution: any, expectedResult: any) => {
			act(() => {
				resizeWindow(resolution - 1);
			});
			const hookValue = testHook(values);
			expect(hookValue).toEqual(expectedResult);
		},
	);
});
