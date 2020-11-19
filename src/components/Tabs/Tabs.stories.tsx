import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Txt } from '../../';
import { Tab, Tabs, TabsProps } from '.';

export default {
	title: 'Core/Tabs',
	component: Tabs,
	subcomponents: { Tab },
} as Meta;

const Template = createTemplate<TabsProps>(Tabs);

export const Default = createStory<TabsProps>(Template, {
	children: [
		<Tab title="Tab 1">
			<Txt mt={3}>Here is tab #1</Txt>
		</Tab>,
		<Tab title="Tab 2">
			<Txt mt={3}>Here is tab #2</Txt>
		</Tab>,
		<Tab title="Tab 3">
			<Txt mt={3}>Here is tab #3</Txt>
		</Tab>,
	],
});

export const WithLongTitles = createStory<TabsProps>(Template, {
	children: [
		<Tab title="This is a very long tab name">
			<Txt mt={3}>Here is tab #1</Txt>
		</Tab>,
		<Tab title="This is another very long tab name">
			<Txt mt={3}>Here is tab #2</Txt>
		</Tab>,
		<Tab title="And this is a third very long tab name">
			<Txt mt={3}>Here is tab #3</Txt>
		</Tab>,
	],
});

export const Compact = createStory<TabsProps>(Template, {
	compact: true,
	children: [
		<Tab title="Tab 1">
			<Txt mt={3}>Here is tab #1</Txt>
		</Tab>,
		<Tab title="Tab 2">
			<Txt mt={3}>Here is tab #2</Txt>
		</Tab>,
		<Tab title="Tab 3">
			<Txt mt={3}>Here is tab #3</Txt>
		</Tab>,
		<Tab title="This is a very long tab name">
			<Txt mt={3}>Here is tab #1</Txt>
		</Tab>,
		<Tab title="This is another very long tab name">
			<Txt mt={3}>Here is tab #2</Txt>
		</Tab>,
		<Tab title="And this is a third very long tab name testing">
			<Txt mt={3}>
				Ut eu nulla commodo, sodales est at, ornare quam. Vivamus pellentesque
				interdum leo, in molestie libero vestibulum nec. Aenean sollicitudin
				volutpat sollicitudin. Sed quis facilisis lacus. Sed ac congue neque.
				Mauris feugiat lectus nec mauris blandit, sit amet scelerisque justo
				mollis. Sed pellentesque neque neque, sed laoreet urna imperdiet et.
				Vestibulum enim quam, posuere in magna quis, iaculis consectetur augue.
				Fusce sit amet tempus enim. Mauris at nunc volutpat, facilisis purus in,
				porttitor ex. Sed ornare orci at leo aliquam tempor. Maecenas
				ullamcorper ante in auctor pellentesque. Phasellus vitae ultrices
				ligula, a vehicula lectus. Ut finibus, justo id consequat mattis, neque
				nibh auctor risus, sit amet tristique purus velit nec lorem. Donec
				semper volutpat dictum. Vestibulum aliquet pharetra nulla eget
				pellentesque. Suspendisse aliquam sodales nulla maximus maximus. Mauris
				tincidunt tincidunt lorem, sed egestas leo tempor nec. Mauris convallis
				viverra purus in consequat. Nam at pharetra est. Praesent varius, tortor
				sit amet tristique placerat, mauris nibh malesuada magna, nec
				sollicitudin nunc magna ac justo. Nam sit amet nibh velit. Nunc eu ex ac
				nunc mattis hendrerit. Cras eleifend quis quam nec vestibulum. Mauris
				vulputate tortor in erat sollicitudin, in pulvinar metus porttitor.
				Vestibulum ac eleifend elit. Quisque gravida dignissim nisi, sed maximus
				ante vehicula non. Vestibulum vestibulum est sed tortor placerat, id
				aliquet libero luctus. Vestibulum hendrerit at turpis sit amet posuere.
			</Txt>
		</Tab>,
	],
});
