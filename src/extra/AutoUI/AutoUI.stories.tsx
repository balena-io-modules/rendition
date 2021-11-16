import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import {
	autoUIGetModelForCollection,
	autoUIRunTransformers,
} from './models/helpers';
import {
	dataExample,
	AugmentedSshKey,
	model as sshKeyModel,
	transformers,
} from './models/example';
import { AutoUI as RenditionAutoUI, AutoUIProps } from '.';
import { Button } from '../../components/Button';
import flatten from 'lodash/flatten';
import { Heading } from '../../components/Heading';

export default {
	title: 'Extra/AutoUI',
	component: RenditionAutoUI,
} as Meta;

const DemoAutoUI = ({
	data,
	model,
	...otherProps
}: AutoUIProps<AugmentedSshKey>) => {
	const [dataIsArray, setDataIsArray] = React.useState(true);

	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<>
			<Heading.h5>
				The AutoUI component determines whether to use an AutoUICollection or
				AutoUIEntity based on the value passed into it for its "data" property.
				Click the button below to change the value passed in for "data".
			</Heading.h5>
			<Button
				onClick={() => setDataIsArray(!dataIsArray)}
				label={`Pass an ${dataIsArray ? 'entity' : 'array'} for "data"`}
				my={3}
			/>
			<RenditionAutoUI<AugmentedSshKey>
				data={
					dataIsArray
						? data ?? memoizedData
						: flatten([data ?? memoizedData])[0]
				}
				model={model ?? autoUIGetModelForCollection(sshKeyModel)}
				actions={[]}
				{...otherProps}
			/>
		</>
	);
};

const Template = createTemplate<AutoUIProps<AugmentedSshKey>>(DemoAutoUI);

export const Default = createStory<AutoUIProps<AugmentedSshKey>>(Template, {});
