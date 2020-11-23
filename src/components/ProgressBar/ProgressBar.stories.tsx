import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { ProgressBar, ProgressBarProps } from '.';

const ProgressBarDemo = (props: ProgressBarProps) => {
	const [value, setValue] = React.useState(props.value ?? 0);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setValue((val) => (val > 100 ? 0 : val + 1));
		}, 250);

		return () => clearInterval(interval);
	}, []);

	return (
		<ProgressBar {...props} value={value}>
			{value}%
		</ProgressBar>
	);
};

export default {
	title: 'Core/ProgressBar',
	component: ProgressBar,
} as Meta;

const Template = createTemplate<ProgressBarProps>(ProgressBarDemo);

export const Default = createStory<ProgressBarProps>(Template, {
	value: 10,
});

export const DifferentColor = createStory<ProgressBarProps>(Template, {
	value: 10,
	danger: true,
});

export const Emphasized = createStory<ProgressBarProps>(Template, {
	value: 10,
	emphasized: true,
});
