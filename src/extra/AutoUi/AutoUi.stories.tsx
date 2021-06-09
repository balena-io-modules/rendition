import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { AutoUICollection, AutoUICollectionProps } from './Collection';
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

export default {
	title: 'Extra/AutoUICollection',
	component: AutoUICollection,
} as Meta;

const DemoCollection = ({
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
		<AutoUICollection<AugmentedSshKey>
			data={data ?? memoizedData}
			model={model ?? autoUIGetModelForCollection(sshKeyModel)}
			actions={[]}
			{...otherProps}
		/>
	);
};

const Template =
	createTemplate<AutoUICollectionProps<AugmentedSshKey>>(DemoCollection);

export const Default = createStory<AutoUICollectionProps<AugmentedSshKey>>(
	Template,
	{},
);
