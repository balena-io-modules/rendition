import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Img, ImgProps } from '.';
// @ts-ignore
import logo from '../../stories/assets/balena.png';

export default {
	title: 'Core/Img',
	component: Img,
} as Meta;

const Template = createTemplate<ImgProps>(Img);

export const Default = createStory<ImgProps>(Template, {
	src: logo,
});
