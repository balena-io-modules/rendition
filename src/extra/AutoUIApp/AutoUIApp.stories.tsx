import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { AutoUIApp, AutoUIAppProps } from '.';
// @ts-expect-error
import logo from './demo/logo.svg';
import { OpenApiJson } from './openApiJson';

export default {
	title: 'Extra/AutoUIApp',
	component: AutoUIApp,
} as Meta;

const DemoAutoUIApp = () => {
	const [openApiJson, setOpenApiJson] = React.useState<OpenApiJson | null>();
	React.useEffect(() => {
		fetch(process.env.OPEN_API_ODATA_JSON_PATH as string)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setOpenApiJson(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	if (!openApiJson) {
		return null;
	}

	return (
		<AutoUIApp title="AutoUIApp Demo" logo={logo} openApiJson={openApiJson} />
	);
};

const Template = createTemplate<AutoUIAppProps>(DemoAutoUIApp);

export const Default = createStory<AutoUIAppProps>(Template, {});
