import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Badge, BadgeProps } from '.';

export default {
	title: 'Core/Badge',
	component: Badge,
} as Meta;

const Template = createTemplate<BadgeProps>(Badge);
export const Default = createStory<BadgeProps>(Template, {
	shade: 0,
	children: 'Badge',
});
