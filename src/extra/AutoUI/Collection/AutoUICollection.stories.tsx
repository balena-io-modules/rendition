import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../../stories/utils';
import {
	autoUIGetModelForCollection,
	autoUIRunTransformers,
} from '../models/helpers';
import {
	dataExample,
	AugmentedSshKey,
	model as sshKeyModel,
	transformers,
} from '../models/example';
import {
	AutoUICollection as RenditionAutoUICollection,
	AutoUICollectionProps,
} from '.';

export default {
	title: 'Extra/AutoUICollection',
	component: RenditionAutoUICollection,
} as Meta;

const DemoAutoUICollection = ({
	data,
	model,
	...otherProps
}: AutoUICollectionProps<AugmentedSshKey>) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<RenditionAutoUICollection<AugmentedSshKey>
			data={data ?? memoizedData}
			model={model ?? autoUIGetModelForCollection(sshKeyModel)}
			actions={[]}
			{...otherProps}
		/>
	);
};

const Template =
	createTemplate<AutoUICollectionProps<AugmentedSshKey>>(DemoAutoUICollection);

export const Default = createStory<AutoUICollectionProps<AugmentedSshKey>>(
	Template,
	{},
);
