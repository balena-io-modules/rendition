import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Changelog, ChangelogProps } from '.';
import { ChangelogButton as ChangelogButtonComponent } from './ChangelogButton';
import { Flex } from '../Flex';
import theme from '../../theme';

const getChangelog = () => `# v3.4.1
## (2022-04-01)

* Improved codebase

# v3.4.0
## (2022-03-30)

* Added a feature

# v3.3.6
## (2022-03-30)

* Fixed a bug`;

const ChangelogDemo = (props: ChangelogProps) => {
	return <Changelog {...props} />;
};

const ChangelogModalDemo = (props: ChangelogProps) => {
	return (
		<Flex>
			<ChangelogButtonComponent
				{...props}
				style={{ background: theme.colors.primary.main }}
				color="white"
			/>
		</Flex>
	);
};

export default {
	title: 'Core/Changelog',
	component: Changelog,
} as Meta;

const Template = createTemplate<ChangelogProps>(ChangelogDemo);

const ButtonTemplate = createTemplate<ChangelogProps>(ChangelogModalDemo);

export const Default = createStory<ChangelogProps>(Template, { getChangelog });

export const ChangelogButton = createStory<ChangelogProps>(ButtonTemplate, {
	getChangelog,
});
