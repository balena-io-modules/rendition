import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Accordion, AccordionProps } from '.';

export default {
	title: 'Core/Accordion',
	component: Accordion,
} as Meta;

const Template = createTemplate<AccordionProps>(Accordion);

export const Default = createStory<AccordionProps>(Template, {
	items: [
		{ label: 'Heading one', panel: 'First Panel' },
		{ label: 'Second Heading', panel: 'Second Panel' },
	],
});
