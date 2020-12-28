import React from 'react';
import { mount } from 'enzyme';
import { Provider } from '../../';
import { Breadcrumbs } from './';
import { Txt } from '../Txt';

describe('Breadcrumbs component', () => {
	describe('crumbs property', () => {
		it('should render the Breadcrumbs with four routes', () => {
			const crumbs = [
				{ text: 'route 1' },
				{ text: 'route 2' },
				{ text: 'route 3' },
				{ text: 'route 4' },
			];
			const component = mount(
				<Provider>
					<Breadcrumbs crumbs={crumbs} />
				</Provider>,
			);
			const crumbsContent = component.findWhere(
				(node) => node.is(Txt) && !!node.prop('truncate'),
			);
			expect(crumbsContent).toHaveLength(4);
			crumbsContent.forEach((crumb, index) => {
				expect(crumb.text()).toEqual(crumbs[index].text);
			});
		});
	});
});
