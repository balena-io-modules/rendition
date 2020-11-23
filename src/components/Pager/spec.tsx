import { mount } from 'enzyme';
import noop from 'lodash/noop';
import React from 'react';
import sinon from 'sinon';
import { Pager, Provider } from '../../';

describe('Pager component', () => {
	it('should disable the "prev" button on page 0', () => {
		const callback = sinon.spy();
		const component = mount(
			<Provider>
				<Pager
					totalItems={436}
					itemsPerPage={50}
					page={0}
					nextPage={noop}
					prevPage={callback}
				/>
			</Provider>,
		);

		const firstButton = component.find('button').first();
		firstButton.simulate('click');

		expect(callback.callCount).toEqual(0);
		expect(firstButton.prop('disabled')).toEqual(true);
	});

	it('should disable the "next" button on the last page', () => {
		const callback = sinon.spy();
		const component = mount(
			<Provider>
				<Pager
					totalItems={100}
					itemsPerPage={50}
					page={1}
					nextPage={callback}
					prevPage={noop}
				/>
			</Provider>,
		);

		const lastButton = component.find('button').last();
		lastButton.simulate('click');

		expect(callback.callCount).toEqual(0);
		expect(lastButton.prop('disabled')).toEqual(true);
	});
});
