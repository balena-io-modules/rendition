import React from 'react';
import { Meta } from '@storybook/react';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons/faMapSigns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createTemplate, createStory } from '../../stories/utils';
import { Step, Steps, StepsProps } from '.';

export default {
	title: 'Core/Steps',
	component: Steps,
	subcomponents: { Step },
} as Meta;

const Template = createTemplate<StepsProps>(Steps);

export const Default = createStory<StepsProps>(Template, {
	children: [
		<Step status="completed">These are</Step>,
		<Step status="completed">all completed</Step>,
		<Step status="completed">and not clickable</Step>,
	],
});

export const WithCustomTitle = createStory<StepsProps>(Template, {
	titleIcon: <FontAwesomeIcon icon={faMapSigns} />,
	titleText: 'Beginners Guide',
	children: [
		<Step status="completed">These are</Step>,
		<Step status="completed">all completed</Step>,
		<Step status="completed">and not clickable</Step>,
	],
});

export const WithoutBorders = createStory<StepsProps>(Template, {
	bordered: false,
	children: [
		<Step status="completed" onClick={() => null}>
			Doesn't have
		</Step>,
		<Step status="pending" onClick={() => null}>
			Title or dismiss button
		</Step>,
		<Step status="none" onClick={() => null}>
			That's it (no icon)
		</Step>,
	],
});

export const Ordered = createStory<StepsProps>(Template, {
	ordered: true,
	activeStepIndex: 1,
	children: [
		<Step status="completed">These are</Step>,
		<Step status="pending">all completed</Step>,
		<Step status="pending">and not clickable</Step>,
	],
});
