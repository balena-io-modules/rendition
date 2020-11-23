import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Button, Provider } from '../../';

test('onClick is called after confirmation', () => {
	const handleClick = sinon.spy();

	const component = mount(
		<Provider>
			<Button confirmation={'Sure?'} onClick={handleClick} m={2}>
				Click me
			</Button>
		</Provider>,
	);

	// Popup should not be visible until button is clicked
	expect(component.find('Popover Box[children="Sure?"]')).toHaveLength(0);

	// Open the confirmation
	component.find('button[children="Click me"]').simulate('click');

	// Popup should become visible
	expect(component.find('div[children="Sure?"]')).toHaveLength(1);

	// Press Cancel
	component.find('button[children="Cancel"]').simulate('click');

	// onClick should not be called
	expect(handleClick.callCount).toEqual(0);

	// Open the confirmation
	component.find('button[children="Click me"]').simulate('click');

	// Press OK
	component.find('button[children="OK"]').simulate('click');

	// onClick should be called with an event
	expect(handleClick.callCount).toEqual(1);
	expect(handleClick.lastCall.args[0]).toHaveProperty('target');
});
