import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import JsonSchemaRendererPlayground from './JsonSchemaRendererPlayground';
// TODO: Change to named export on the next major.
import { JsonSchemaRenderer, JsonSchemaRendererProps } from '.';
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
	title: 'Extra/JsonSchemaRenderer',
	component: JsonSchemaRenderer,
} as Meta;

const Template = createTemplate<JsonSchemaRendererProps>(JsonSchemaRenderer);
const PlaygroundTemplate = createTemplate<JsonSchemaRendererProps>(
	JsonSchemaRendererPlayground,
);

export const Default = createStory<JsonSchemaRendererProps>(Template, {
	...examples['An object with various properties'],
});

export const Playground = createStory<JsonSchemaRendererProps>(
	PlaygroundTemplate,
	{
		examples,
		flex: 1,
		height: '100%',
	},
);

Playground.decorators = [
	(Story) => (
		<>
			<GlobalStyle />
			<Story />
		</>
	),
];
