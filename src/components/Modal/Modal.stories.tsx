import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Box, Button, Heading } from '../../';
import { Modal, ModalProps } from '.';

import PokeDex from '../../stories/assets/pokedex';

const NestedModalDemo = (props: Partial<ModalProps>) => {
	const [show1, setShow1] = React.useState(false);
	const [show2, setShow2] = React.useState(false);

	return (
		<Box>
			<Button primary onClick={() => setShow1(true)}>
				Open Modal
			</Button>
			{show1 && (
				<Modal
					title="First Modal"
					{...props}
					cancel={() => {
						setShow1(false);
						props.cancel?.();
					}}
					done={() => {
						setShow2(true);
						props.done?.();
					}}
					action="Open another modal"
				>
					{show2 && (
						<Modal
							title="Second Modal"
							{...props}
							cancel={() => {
								setShow2(false);
								props.cancel?.();
							}}
							done={() => {
								setShow2(false);
								props.done?.();
							}}
						/>
					)}
				</Modal>
			)}
		</Box>
	);
};

export default {
	title: 'Core/Modal',
	component: Modal,
} as Meta;

const Template = createTemplate<ModalProps>(NestedModalDemo);

export const Default = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
});

export const CustomAction = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
	action: 'Go!',
});

export const NoCancel = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
	// cancel: null,
});

export const WithTitleDetails = createStory<ModalProps>(Template, {
	title: 'Modal title',
	titleDetails: 'Optional details',
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
});

export const WithCustomWidth = createStory<ModalProps>(Template, {
	title: 'Modal title',
	titleDetails: 'Optional details',
	width: ['auto', 500, 1000],
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
});

export const WithMultielementTitle = createStory<ModalProps>(Template, {
	titleElement: (
		<React.Fragment>
			<Heading.h3>Heading</Heading.h3>
			<Button mt={3} primary>
				A button
			</Button>
		</React.Fragment>
	),
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
});

export const WithCustomizedButtons = createStory<ModalProps>(Template, {
	title: 'Modal title',
	secondaryButtonProps: {
		children: 'Refresh',
		onClick: () => null,
	},
	cancelButtonProps: {
		children: 'Abort',
		width: 150,
		style: {
			marginRight: 30,
		},
	},
	primaryButtonProps: {
		width: 150,
		danger: true,
		primary: false,
		disabled: true,
	},
	children: (
		<>
			<p>Lorem ipsum dolor sit amet</p>
		</>
	),
});

export const WithOverflowingContent = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			{PokeDex.map((x, i) => (
				<p key={i}>{x.Description}</p>
			))}
		</>
	),
});

export const WithTooltip = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			<Heading.h5 tooltip={{ text: 'Good job!', trigger: 'hover' }}>
				Hover me and a tooltip will be displayed.
			</Heading.h5>
		</>
	),
});

export const Nested = createStory<ModalProps>(Template, {
	title: 'Modal title',
	children: (
		<>
			<NestedModalDemo />
		</>
	),
});
