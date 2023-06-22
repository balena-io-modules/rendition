import { mount } from 'enzyme';
import React from 'react';

import {
	Filters,
	Provider,
	SchemaSieve,
	Select,
	Tag,
	DropDownButton,
} from '../../';
import { Summary } from '../../components/Filters/Summary';
import type { JSONSchema7 } from 'json-schema';
import { Keyboard } from 'grommet';

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
			title: 'Tag',
			type: 'object',
			properties: {
				tag_name: {
					title: 'Tag name',
					description: 'key',
					type: 'string',
				},
				tag_value: {
					description: 'value',
					title: 'Tag value',
					type: 'string',
				},
			},
		},
	},
} as JSONSchema7;

const filter = SchemaSieve.createFilter(schema, [
	{
		title: 'Name',
		field: 'Name',
		operator: { slug: 'is', label: 'is' },
		value: 'Squirtle',
	},
]);

const tagIsFilter = SchemaSieve.createFilter(schema, [
	{
		title: 'Tag',
		field: 'Tag',
		operator: { slug: 'is', label: 'is' },
		value: { tag_name: 'rarity', tag_value: '10' },
	},
]);

const tagIsNotFilter = SchemaSieve.createFilter(schema, [
	{
		title: 'Tag',
		field: 'Tag',
		operator: { slug: 'is_not', label: 'is not' },
		value: { tag_name: 'rarity', tag_value: '10' },
	},
]);

const view = {
	id: 'abcde',
	name: 'Test',
	scope: null,
	filters: [filter],
};

describe('Filters component', () => {
	describe('filters property', () => {
		it('should not render a summary if there are no filters', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} />
				</Provider>,
			);

			expect(component.find(Summary)).toHaveLength(0);

			component.unmount();
		});

		it('should render a summary of filters that are provided as props', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[filter]} />
				</Provider>,
			);

			expect(component.find(Summary)).toHaveLength(1);

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

			expect(component.find(Summary)).toHaveLength(1);

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

			expect(component.find(Summary)).toHaveLength(0);
			component.unmount();
		});

		it('should show the correct label when filtering using "is" operator for both key and value properties of an object', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[tagIsFilter]} />
				</Provider>,
			);
			expect(component.find(Tag).text()).toBe(
				'Tag is tag_name: rarity, tag_value: 10',
			);
		});

		it('should show the correct label when filtering using "is_not" operator for both key and value properties of an object', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[tagIsNotFilter]} />
				</Provider>,
			);
			expect(component.find(Tag).text()).toBe(
				'Tag is not tag_name: rarity, tag_value: 10',
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
			const view = mount(
				<Provider>
					<Filters schema={schema} filters={[filter]} showSaveView />
				</Provider>,
			);

			// Looking for 'Save view' button
			view.find('button').at(3).simulate('click');
			expect(view.find(Select)).toHaveLength(0);

			view.unmount();
		});
	});

	describe('views property', () => {
		it('should not render a views menu if there are no views', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} />
				</Provider>,
			);

			component.find(DropDownButton).find('button').simulate('click');
			expect(component.html()).toContain("You haven't created any views yet");
			component.unmount();
		});

		it('should render a list of views that are provided as props', () => {
			const component = mount(
				<Provider>
					<Filters schema={schema} views={[view]} />
				</Provider>,
			);

			component.find(DropDownButton).find('button').simulate('click');
			expect(component.find('svg')).toHaveLength(5);
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
			component.find(DropDownButton).find('button').simulate('click');
			expect(component.find('svg')).toHaveLength(5);
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
			component.find(DropDownButton).find('button').simulate('click');
			expect(component.html()).toContain("You haven't created any views yet");
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

		it('should clear all filters when `clear all filters` gets clicked', () => {
			const defaultFilters = SchemaSieve.createFilter(schema, [
				{
					title: 'Name',
					field: 'Name',
					operator: { slug: 'contains', label: 'contains' },
					value: 's',
				},
				{
					title: 'Name',
					field: 'Name',
					operator: { slug: 'contains', label: 'contains' },
					value: 'q',
				},
			]);

			const component = mount(
				<Provider>
					<Filters schema={schema} filters={[defaultFilters]} />
				</Provider>,
			);

			expect(component.find(Summary)).toHaveLength(1);

			component
				.find('input')
				.simulate('change', { target: { value: 'Squirtle' } });
			component.find(Keyboard).simulate('keypress', { key: 'Enter' });
			expect(component.text()).toContain('Clear all');

			component
				.findWhere((node) => node.text() === 'Clear all')
				.at(1)
				.simulate('click');
			expect(component.find(Summary)).toHaveLength(0);

			component.unmount();
		});
	});
});
