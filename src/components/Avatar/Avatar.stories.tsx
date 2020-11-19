import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Avatar, AvatarProps } from '.';

export default {
	title: 'Core/Avatar',
	component: Avatar,
} as Meta;

const Template = createTemplate<AvatarProps>(Avatar);

export const Default = createStory<AvatarProps>(Template, {});

export const WithFullName = createStory<AvatarProps>(Template, {
	firstName: 'John',
	lastName: 'Doe',
});

export const WithFirstName = createStory<AvatarProps>(Template, {
	firstName: 'John',
});

export const WithLastName = createStory<AvatarProps>(Template, {
	lastName: 'Doe',
});

export const WithImage = createStory<AvatarProps>(Template, {
	src: 'https://dashboard.balena-cloud.com/img/logo.svg',
});

export const Emphasized = createStory<AvatarProps>(Template, {
	firstName: 'John',
	lastName: 'Doe',
	emphasized: true,
});
