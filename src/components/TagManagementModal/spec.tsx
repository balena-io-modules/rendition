import React from 'react';
import { TagManagementModal, TagManagementModalProps } from '.';
import { mount } from 'enzyme';
import { Button } from '../Button';
import { Provider } from '../Provider';
import { Input } from '../Input';
import { SimpleConfirmationModal } from '../../internal/SimpleConfirmationModal';
import { useTranslation } from '../../hooks/useTranslation';

export const itemsExample = [
	{
		id: 1,
		name: 'item-with-tag-1',
		tag_field: [
			{
				tag_key: 'tag1-key',
				value: 'tag-value',
			},
			{
				tag_key: 'tag2-key',
				value: 'tag3-value',
			},
			{
				tag_key: 'tag3-key',
				value: 'tag3-value',
			},
		],
	},
	{
		id: 2,
		name: 'item-with-tag-2',
		tag_field: [
			{
				tag_key: 'tag1-key',
				value: 'tag-value',
			},
			{
				tag_key: 'tag2-key',
				value: 'tag3-value',
			},
		],
	},
];

const TagManagement = () => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const { t } = useTranslation();
	return (
		<>
			<Button onClick={() => setIsModalOpen(true)} primary>
				{t('labels.tags')}
			</Button>
			{isModalOpen && (
				<TagManagementModal<any>
					{...props}
					cancel={() => setIsModalOpen(false)}
					done={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
};

const props = {
	items: itemsExample,
	itemType: 'tag',
	titleField: 'name',
	tagField: 'tag_field',
} as TagManagementModalProps<any>;

describe('TagManagement component', () => {
	it('Should render the TagManagement component', () => {
		const component = mount(
			<Provider>
				<TagManagement />
			</Provider>,
		);
		const button = component.findWhere(
			(node) => node.is(Button) && typeof node.prop('children') === 'string',
		);
		expect(button.text()).toEqual('Tags');
	});

	it('Should render the TagManagement modal component', () => {
		const component = mount(
			<Provider>
				<TagManagement />
			</Provider>,
		);
		const button = component.findWhere(
			(node) => node.is(Button) && typeof node.prop('children') === 'string',
		);
		button.simulate('click');
		const modal = component.find(TagManagementModal);
		expect(modal).toHaveLength(1);
	});

	it('Should render the TagManagement overwrite alert modal component', () => {
		const component = mount(
			<Provider>
				<TagManagement />
			</Provider>,
		);
		const button = component.findWhere(
			(node) => node.is(Button) && typeof node.prop('children') === 'string',
		);
		button.simulate('click');
		const modal = component.find(TagManagementModal);
		const keyInput = modal.find(Input).first();
		const valueInput = modal.find(Input).last();
		keyInput
			.find('input')
			.simulate('change', { target: { value: 'tag3-key' } });
		valueInput
			.find('input')
			.simulate('change', { target: { value: 'running-test' } });
		const addTagButton = modal.findWhere(
			(node) => node.is(Button) && node.text() === 'Add tag',
		);
		addTagButton.simulate('click');
		const alertModal = component.find(SimpleConfirmationModal);
		expect(alertModal.find('h3').text()).toBe(
			'Adding this would overwrite tags on tag',
		);
	});

	it('Should disable Add tag button if tag key is empty', () => {
		const component = mount(
			<Provider>
				<TagManagement />
			</Provider>,
		);
		const button = component.findWhere(
			(node) => node.is(Button) && typeof node.prop('children') === 'string',
		);
		button.simulate('click');
		const modal = component.find(TagManagementModal);
		const addTagButton = modal.findWhere(
			(node) => node.is(Button) && node.text() === 'Add tag',
		);
		expect(addTagButton.prop('disabled')).toBe(true);
	});
});
