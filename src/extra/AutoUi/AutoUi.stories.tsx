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
	model,
	SshKeyWithoutPermissions,
	transformers,
} from './models/example';

export default {
	title: 'Extra/AutoUICollection',
	component: AutoUICollection,
} as Meta;

const DemoCollection = (
	_props: AutoUICollectionProps<SshKeyWithoutPermissions>,
) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<AutoUICollection<AugmentedSshKey>
			data={memoizedData}
			model={autoUIGetModelForCollection(model)}
			actions={[]}
		/>
	);
};

const Template =
	createTemplate<AutoUICollectionProps<SshKeyWithoutPermissions>>(
		DemoCollection,
	);

export const Default = createStory<
	AutoUICollectionProps<SshKeyWithoutPermissions>
>(Template, {});
