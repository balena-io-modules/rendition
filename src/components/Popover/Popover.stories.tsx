import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Popover, PopoverProps } from '.';
import { Box, Txt } from '../..';

const PopoverDemo = (props: PopoverProps) => {
	const [target, setTarget] = React.useState<any>(null);

	return (
		<Box m={3}>
			{target && <Popover target={target} {...props}></Popover>}
			<span ref={setTarget}>Popover target</span>
		</Box>
	);
};

export default {
	title: 'Core/Popover',
	component: Popover,
	parameters: {
		docs: {
			inlineStories: false,
			iframeHeight: 100,
		},
	},
} as Meta;

const Template = createTemplate<PopoverProps>(PopoverDemo);

export const Default = createStory<PopoverProps>(Template, {
	children: (
		<Txt align="center" p={3}>
			Popover content
		</Txt>
	),
	placement: 'right',
});
