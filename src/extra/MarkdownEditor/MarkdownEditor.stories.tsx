import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { MarkdownEditor, MarkdownEditorProps } from '.';
import source from '../../stories/assets/markdownSample';

export default {
	title: 'Extra/MarkdownEditor',
	component: MarkdownEditor,
} as Meta;

const Template = createTemplate<MarkdownEditorProps>(MarkdownEditor);
export const Default = createStory<MarkdownEditorProps>(Template, {
	value: source,
});

export const WithFileUpload = createStory<MarkdownEditorProps>(Template, {
	value: source,
	fileUploadFunction: async (file: File) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return `/${file.name}`;
	},
});
