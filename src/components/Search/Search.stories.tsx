import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Search, SearchProps } from '.';

export default {
	title: 'Core/Search',
	component: Search,
} as Meta;

const Template = createTemplate<SearchProps>(Search);

export const Default = createStory<SearchProps>(Template, {});

export const Disabled = createStory<SearchProps>(Template, { disabled: true });

export const Dark = createStory<SearchProps>(Template, { dark: true });

export const WithPlaceholder = createStory<SearchProps>(Template, {
	placeholder: 'Search here',
});
