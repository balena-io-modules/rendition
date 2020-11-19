import { mount } from 'enzyme';
import React from 'react';

import { Filters, Provider, SchemaSieve, Search, Select, Txt } from '../../';
import FiltersSummary from '../../components/Filters/Summary';
import { ViewListItem } from '../../components/Filters/ViewsMenu';
import { JSONSchema7 } from 'json-schema';

/* FieldSummary buttons in order:
  0. Clear all filters
  1. Save view
  2. Edit single filter
  3. Remove filter
*/

const schema = {
	type: 'object',
	properties: {
		Name: {
			title: 'Pokemon Name',
			type: 'string',
		},
		Tag: {
			type: 'object',
			properties: {
				tag_name: {
					title: 'Name',
					description: 'key',
					type: 'string',
				},
				tag_value: {
					description: 'value',
					title: 'Value',
					type: 'string',
				},
			},
		},
	},
} as JSONSchema7;

const filter = SchemaSieve.createFilter(schema, [
	{
		field: 'Name',
		operator: 'is',
		value: 'Squirtle',
	},
]);

const tagIsFilter = SchemaSieve.createFilter(schema, [
	{
		field: 'Tag',
		operator: 'is',
		value: { tag_name: 'rarity', tag_value: '10' },
	},
]);

const tagIsNotFilter = SchemaSieve.createFilter(schema, [
	{
		field: 'Tag',
		operator: 'is_not',
		value: { tag_name: 'rarity', tag_value: '10' },
	},
]);

const view = {
	id: 'abcde',
	name: 'Test',
	scope: null,
	filters: [filter],
};

const viewScopes = [
	{
		slug: 'foo',
		name: 'foo',
	},
	{
		slug: 'bar',
		name: 'bar',
	},
];

describe('Filters component', () => {
	describe('filters property', () => {
		it('should not render a summary if there are no filters', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} />
				</Provider>,
			);

			expect(component.find(FiltersSummary)).toHaveLength(0);

			component.unmount();
		});

		it('should render a summary of filters that are provided as props', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[filter]} />
				</Provider>,
			);

			expect(component.find(FiltersSummary)).toHaveLength(1);

			component.unmount();
		});

		it('should render a summary of filters that are added as props after the component mounts', () => {
			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Filters {...props} />
						</Provider>
					),
					{ schema },
				),
			);

			component.setProps({ filters: [filter] } as any);
			component.update();

			expect(component.find(FiltersSummary)).toHaveLength(1);

			component.unmount();
		});

		it('should not render a summary of filters if they are removed after the component mounts', () => {
			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Filters {...props} />
						</Provider>
					),
					{ schema, filters: [filter] },
				),
			);

			component.setProps({ filters: null } as any);
			component.update();

			expect(component.find(FiltersSummary)).toHaveLength(0);
			component.unmount();
		});

		it('should show the correct label when filtering using "is" operator for both key and value properties of an object', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[tagIsFilter]} />
				</Provider>,
			);
			expect(component.find('button').at(4).text()).toBe('Tag is rarity : 10');
		});

		it('should show the correct label when filtering using "is_not" operator for both key and value properties of an object', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[tagIsNotFilter]} />
				</Provider>,
			);
			expect(component.find('button').at(4).text()).toBe(
				'Tag is not rarity : 10',
			);
		});

		it('should remove buttons labels if compact property is set to true', () => {
			const component = mount(
				<Provider>
					<Filters compact={[true, true, true, true]} schema={schema} />
				</Provider>,
			);
			expect(component.find('button').at(0).text()).toBe('');
			expect(component.find('button').at(1).text()).toBe('');
		});
	});

	describe('save views modal', () => {
		it('should not show scopes selector if one or less scopes are passed', () => {
			const withOneViewScope = mount(
				<Provider>
					<Filters
						schema={schema}
						filters={[filter]}
						viewScopes={[viewScopes[0]]}
					/>
				</Provider>,
			);

			const withNoViewScopes = mount(
				<Provider>
					<Filters
						schema={schema}
						filters={[filter]}
						viewScopes={[viewScopes[0]]}
					/>
				</Provider>,
			);

			// Looking for 'Save view' button
			withOneViewScope.find('button').at(3).simulate('click');
			expect(withOneViewScope.find(Select)).toHaveLength(0);

			withNoViewScopes.find('button').at(3).simulate('click');
			expect(withNoViewScopes.find(Select)).toHaveLength(0);

			withOneViewScope.unmount();
			withNoViewScopes.unmount();
		});

		it('should show scopes selector if viewScopes are passed', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[filter]} viewScopes={viewScopes} />
				</Provider>,
			);

			// Looking for 'Save view' button
			component.find('button').at(3).simulate('click');
			expect(component.find(Select)).toHaveLength(1);

			component.unmount();
		});
	});

	describe('views property', () => {
		it('should not render a views menu if there are no views', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} />
				</Provider>,
			);

			component.find('button').at(1).simulate('click');
			expect(component.find(ViewListItem)).toHaveLength(0);
			component.unmount();
		});

		it('should render a list of views that are provided as props', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} views={[view]} />
				</Provider>,
			);

			component.find('button').at(1).simulate('click');
			expect(component.find(ViewListItem)).toHaveLength(1);
			component.unmount();
		});

		it('should not render scoped views in the views menu if no scopes are passed', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} views={[{ ...view, scope: 'foo' }]} />
				</Provider>,
			);

			component.find('button').at(1).simulate('click');
			expect(component.find("[children='foo']")).toHaveLength(0);
			expect(component.find("[children='null']")).toHaveLength(0);

			component.unmount();
		});

		it('should not render scoped views in the views menu if one or less scopes are passed', () => {
			const component = mount(
				<Provider>
					<Filters
						schema={schema}
						views={[{ ...view, scope: 'foo' }]}
						viewScopes={[viewScopes[0]]}
					/>
				</Provider>,
			);

			component.find('button').at(1).simulate('click');
			expect(component.find("[children='foo']")).toHaveLength(0);

			component.unmount();
		});

		it('should render scoped views in the views menu if more than one viewScopes are passed', () => {
			const component = mount(
				<Provider>
					<Filters
						schema={schema}
						views={[{ ...view, scope: 'foo' }]}
						viewScopes={viewScopes}
					/>
				</Provider>,
			);

			component.find('button').at(1).simulate('click');

			expect(component.find(Txt).at(0).text()).toEqual('foo');
			expect(component.find("[children='bar']")).toHaveLength(0);

			component.unmount();
		});

		it('should render views as "Unscoped" if they do not have a scope and more than one viewScopes are passed', () => {
			const component = mount(
				<Provider>
					<Filters
						schema={schema}
						views={[{ ...view }]}
						viewScopes={viewScopes}
					/>
				</Provider>,
			);

			component.find('button').at(1).simulate('click');

			expect(component.find(Txt).at(0).text()).toEqual('Unscoped');
			expect(component.find("[children='foo']")).toHaveLength(0);
			expect(component.find("[children='bar']")).toHaveLength(0);

			component.unmount();
		});

		it('should render a list of views that are added as props after the component mounts', () => {
			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Filters {...props} />
						</Provider>
					),
					{ schema },
				),
			);

			component.setProps({ views: [view] } as any);
			component.update();
			component.find('button').at(1).simulate('click');
			expect(component.find(ViewListItem)).toHaveLength(1);
			component.unmount();
		});

		it('should not render a list of views if they are removed after the component mounts', () => {
			const component = mount(
				React.createElement(
					(props) => (
						<Provider>
							<Filters {...props} />
						</Provider>
					),
					{ schema, views: [view] },
				),
			);

			component.setProps({ views: null } as any);
			component.update();
			component.find('button').at(1).simulate('click');
			expect(component.find(ViewListItem)).toHaveLength(0);
			component.unmount();
		});

		it('should render when the schema contains an unknown type', () => {
			const unknownSchema = {
				type: 'object',
				properties: {
					test: {
						type: 'Foo Bar',
					},
				},
			} as any;

			const component = mount(
				<Provider>
					<Filters schema={unknownSchema} />
				</Provider>,
			);

			component.unmount();
		});

		it('should clear the `searchString` state prop after search filter removal', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} views={[view]} />
				</Provider>,
			);

			expect(component.find(Search)).toHaveLength(1);
			expect(component.find(Search).prop('value')).toEqual('');

			component
				.find('input')
				.simulate('change', { target: { value: 'Squirtle' } });
			const searchValue = component
				.find(FiltersSummary)
				.find('button')
				.at(2)
				.text();
			expect(searchValue).toContain('Squirtle');

			component.find(FiltersSummary).find('button').at(3).simulate('click');
			expect(component.find(FiltersSummary)).toHaveLength(0);

			component.unmount();
		});

		it('should clear all filters and `searchString` when `clear all filters` gets clicked', () => {
			const defaultFilters = SchemaSieve.createFilter(schema, [
				{ field: 'Name', operator: 'contains', value: 's' },
				{ field: 'Name', operator: 'contains', value: 'q' },
			]);

			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[defaultFilters]} />
				</Provider>,
			);

			expect(component.find(FiltersSummary)).toHaveLength(1);

			component
				.find('input')
				.simulate('change', { target: { value: 'Squirtle' } });
			const searchValue = component
				.find(FiltersSummary)
				.find('button')
				.at(4)
				.text();
			expect(searchValue).toContain('Squirtle');

			component.find(FiltersSummary).find('button').at(0).simulate('click');
			expect(component.find(FiltersSummary)).toHaveLength(0);
			const inputValue = component.find('input').prop('value');
			expect(inputValue).toEqual('');

			component.unmount();
		});
	});
});
