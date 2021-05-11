import React from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from '../../hooks/useTranslation';
import { TagManagementModal, TagManagementModalProps } from '.';
import { createTemplate, createStory } from '../../stories/utils';
import { Button } from '../Button';

const items = [
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

const TagManagement = (props: TagManagementModalProps<any>) => {
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

export default {
	title: 'Core/TagManagementModal',
	component: TagManagementModal,
} as Meta;

const Template = createTemplate<TagManagementModalProps<any>>(TagManagement);
export const Default = createStory<TagManagementModalProps<any>>(Template, {
	items,
	itemType: 'tag',
	titleField: 'name',
	tagField: 'tag_field',
	done: () => null,
	cancel: () => null,
});
