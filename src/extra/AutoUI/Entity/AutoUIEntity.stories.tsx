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
import flatten from 'lodash/flatten';
import { AutoUIEntity as RenditionAutoUIEntity, AutoUIEntityProps } from '.';

export default {
	title: 'Extra/AutoUIEntity',
	component: RenditionAutoUIEntity,
} as Meta;

const DemoAutoUIEntity = ({
	data,
	model,
	...otherProps
}: AutoUIEntityProps<AugmentedSshKey>) => {
	const memoizedData = React.useMemo(
		() =>
			autoUIRunTransformers(dataExample, transformers, {
				accessRole: 'administrator',
			}),
		[dataExample],
	) as AugmentedSshKey[];

	return (
		<RenditionAutoUIEntity<AugmentedSshKey>
			data={flatten([data ?? memoizedData])[0]}
			model={model ?? autoUIGetModelForCollection(sshKeyModel)}
			actions={[]}
			{...otherProps}
		/>
	);
};

const Template =
	createTemplate<AutoUIEntityProps<AugmentedSshKey>>(DemoAutoUIEntity);

export const Default = createStory<AutoUIEntityProps<AugmentedSshKey>>(
	Template,
	{},
);
