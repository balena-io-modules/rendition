import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Rating, RatingProps } from '.';

export default {
	title: 'Core/Rating',
	component: Rating,
} as Meta;

const Template = createTemplate<RatingProps>(Rating);

export const Default = createStory<RatingProps>(Template, {
	value: 3,
});
