import React from 'react';
import { mount } from 'enzyme';
import { Avatar, Provider } from '../../';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

describe('Avatar component', () => {
	describe('firstName and lastName properties', () => {
		it('should render the Avatar with initials if src is not passed', () => {
			const component = mount(
				<Provider>
					<Avatar firstName="test" lastName="user" />
				</Provider>,
			);
			expect(component.text()).toContain('TU');
		});
	});

	describe('null src, valid firstName and valid lastName properties', () => {
		it('should render the Avatar with initials if src is passed but it is null', () => {
			const component = mount(
				<Provider>
					<Avatar firstName="example" lastName="user" />
				</Provider>,
			);
			expect(component.text()).toContain('EU');
		});
	});

	describe('component with all props to null', () => {
		it('should render fallback icon if no props has value', () => {
			const component = mount(
				<Provider>
					<Avatar />
				</Provider>,
			);
			expect(component.children().find(FontAwesomeIcon)).toHaveLength(1);
		});
	});
});
