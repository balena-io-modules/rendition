import * as React from 'react';
import { mount } from 'enzyme';
import { SurroundingOverlay, Provider } from '../..';

describe('SurroundingOverlay component', () => {
	it('should render the SurroundingOverlay', () => {
		const rect = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			x: 0,
			y: 0,
			height: undefined,
			width: 800,
		};
		const component = mount(
			<Provider>
				<SurroundingOverlay rect={rect} />
			</Provider>,
		);
		expect(component.find(SurroundingOverlay).children()).toHaveLength(4);
	});
	it('should not render the SurroundingOverlay', () => {
		const rect = null;
		const component = mount(
			<Provider>
				<SurroundingOverlay rect={rect} />
			</Provider>,
		);
		expect(component.find(SurroundingOverlay).children()).toHaveLength(0);
	});
});
