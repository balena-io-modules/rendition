import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { AutoUIApp, AutoUIAppProps } from '.';
// @ts-expect-error
import logo from './demo/logo.svg';
import openApiJson from './demo/openApi.json';

export default {
	title: 'Extra/AutoUIApp',
	component: AutoUIApp,
} as Meta;

const DemoAutoUIApp = () => {
	return (
		<AutoUIApp title="AutoUIApp Demo" logo={logo} openApiJson={openApiJson} />
	);
};

const Template = createTemplate<AutoUIAppProps>(DemoAutoUIApp);

export const Default = createStory<AutoUIAppProps>(Template, {});
