import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Heading, HeadingProps } from '.';

export default {
	title: 'Core/Heading',
	component: Heading,
} as Meta;

const DefaultTemplate = createTemplate<HeadingProps>(Heading);

export const Default = createStory<HeadingProps>(DefaultTemplate, {
	children: 'Heading h3',
});

const H1Template = createTemplate<HeadingProps>(Heading.h1);

export const H1 = createStory<HeadingProps>(H1Template, {
	children: 'Heading h1',
});

const H2Template = createTemplate<HeadingProps>(Heading.h2);

export const H2 = createStory<HeadingProps>(H2Template, {
	children: 'Heading h2',
});

const H3Template = createTemplate<HeadingProps>(Heading.h3);

export const H3 = createStory<HeadingProps>(H3Template, {
	children: 'Heading h3',
});

const H4Template = createTemplate<HeadingProps>(Heading.h4);

export const H4 = createStory<HeadingProps>(H4Template, {
	children: 'Heading h4',
});

const H5Template = createTemplate<HeadingProps>(Heading.h5);

export const H5 = createStory<HeadingProps>(H5Template, {
	children: 'Heading h5',
});
