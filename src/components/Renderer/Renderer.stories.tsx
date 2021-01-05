import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { RendererPlayground } from './RendererPlayground';
// TODO: Change to named export on the next major.
import { Renderer, RendererProps } from '.';
import examples from './examples';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  #root,
  #root > div,
  #root > div > div {
    display: flex;
    flex: 1;
    min-width: 0;
  }
  .storybook-readme-story > div {
    margin: 0 !important;
  }
`;

export default {
	title: 'Core/Renderer',
	component: Renderer,
} as Meta;

const Template = createTemplate<RendererProps>(Renderer);
const PlaygroundTemplate = createTemplate<RendererProps>(RendererPlayground);

export const Default = createStory<RendererProps>(Template, {
	...examples['An object with various properties'],
});

export const Playground = createStory<RendererProps>(PlaygroundTemplate, {
	examples,
	flex: 1,
	height: '100%',
});

Playground.decorators = [
	(Story) => (
		<>
			<GlobalStyle />
			<Story />
		</>
	),
];
