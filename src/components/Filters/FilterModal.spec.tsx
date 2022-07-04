jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

import { mount } from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { Provider } from '../..';
import { FilterModal } from './FilterModal';

const sandbox = sinon.createSandbox();

describe('FilterModal', () => {
	const addFilter = sandbox.stub();
	const onClose = sandbox.stub();
	const edit = [
		{
			field: 'name',
			operator: 'is',
			value: '',
		},
	];
	// A schema with two properties that will be filter targets
	const schema: JSONSchema = {
		type: 'object',
		properties: {
			name: {
				type: 'string',
			},
			type: {
				type: 'string',
			},
		},
	};

	afterEach(() => {
		sandbox.reset();
	});

	it('lets the user search for filter fields', () => {
		const component = mount(
			<Provider>
				<FilterModal
					schema={schema}
					addFilter={addFilter}
					edit={edit}
					onClose={onClose}
				/>
			</Provider>,
		);

		// Open the filter select
		const fieldSelect = component.find('Select').first();
		fieldSelect.simulate('click');

		// Both 'name' and 'type' are available options
		let options = component.find(
			'#filtermodal__fieldselect__select-drop button[role="menuitem"]',
		);
		expect(options.length).toBe(2);
		expect(options.at(0).text()).toBe('name');
		expect(options.at(1).text()).toBe('type');

		// Search for 'type'
		const searchInput = component.find('input[placeholder="Search..."]');
		searchInput.simulate('change', { target: { value: 'type' } });

		// Now only the 'type' option is available
		options = component.find(
			'#filtermodal__fieldselect__select-drop button[role="menuitem"]',
		);
		expect(options.length).toBe(1);
		expect(options.at(0).text()).toBe('type');
	});

	it('allows a custom comparer to be provided', () => {
		const component = mount(
			<Provider>
				<FilterModal
					schema={schema}
					addFilter={addFilter}
					edit={edit}
					onClose={onClose}
					fieldCompareFn={(a, b) => {
						// Reverse the sort order
						return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
					}}
				/>
			</Provider>,
		);

		// Open the filter select
		const fieldSelect = component.find('Select').first();
		fieldSelect.simulate('click');

		const options = component.find(
			'#filtermodal__fieldselect__select-drop button[role="menuitem"]',
		);
		expect(options.length).toBe(2);
		// Fields are ordered in reverse-alphabetical order now
		expect(options.at(0).text()).toBe('type');
		expect(options.at(1).text()).toBe('name');
	});
});
