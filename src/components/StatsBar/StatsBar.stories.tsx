import React from 'react';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons/faMicrochip';
import { faMemory } from '@fortawesome/free-solid-svg-icons/faMemory';
import { faHdd } from '@fortawesome/free-solid-svg-icons/faHdd';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { StatsBar, StatsBarProps, StatsTitle, ValueWithMaxTitle } from '.';

export default {
	title: 'Core/StatsBar',
	component: StatsBar,
} as Meta;

const Template = createTemplate<StatsBarProps>(StatsBar);

export const CpuUsage = createStory<StatsBarProps>(Template, {
	title: <StatsTitle icon={faMicrochip} title="CPU" />,
	labelFormatter: ({ value }: { value: number }) => `~${value}%`,
	value: 23,
	max: 100,
	numSlices: 5,
});

export const CpuTemp = createStory<StatsBarProps>(Template, {
	title: <StatsTitle icon={faMicrochip} title="Temperature" />,
	labelFormatter: ({ value }: { value: number }) => `~${value}C`,
	value: 34,
	max: 100,
});

export const Memory = createStory<StatsBarProps>(Template, {
	title: <StatsTitle icon={faMemory} title="Memory" />,
	labelFormatter: () => <ValueWithMaxTitle value="453 MB" max="1 GB" />,
	value: 453,
	max: 1000,
});

export const Storage = createStory<StatsBarProps>(Template, {
	title: (
		<StatsTitle
			icon={faHdd}
			title="Storage"
			description="Storage block device"
		/>
	),
	labelFormatter: () => <ValueWithMaxTitle value="623 MB" max="1 GB" />,
	value: 623,
	max: 1000,
});
