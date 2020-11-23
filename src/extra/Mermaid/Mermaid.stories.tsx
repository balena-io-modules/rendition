import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Mermaid, MermaidProps } from '.';

export default {
	title: 'Extra/Mermaid',
	component: Mermaid,
} as Meta;

const Template = createTemplate<MermaidProps>(Mermaid);
export const Default = createStory<MermaidProps>(Template, {
	value: `
  graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
  `,
});
