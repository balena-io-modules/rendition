import React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { SurroundingOverlay, SurroundingOverlayProps, PartialDomRect } from '.';
import { Input } from '../Input';

const SurroundingOverlayDemo = (props: SurroundingOverlayProps) => {
	const [rect, setRect] = React.useState<PartialDomRect | null>(null);
	return (
		<>
			<SurroundingOverlay {...props} rect={rect} />
			<Input
				mb={4}
				type="text"
				onFocus={(e) => setRect(e.target.getBoundingClientRect())}
				onBlur={() => setRect(null)}
			/>
			<Input
				mb={4}
				type="text"
				onFocus={(e) => setRect(e.target.getBoundingClientRect())}
				onBlur={() => setRect(null)}
			/>
			<Input
				type="datetime-local"
				onFocus={(e) => setRect(e.target.getBoundingClientRect())}
				onBlur={() => setRect(null)}
			/>
		</>
	);
};

export default {
	title: 'Core/SurroundingOverlay',
	component: SurroundingOverlay,
} as Meta;

const Template = createTemplate<SurroundingOverlayProps>(
	SurroundingOverlayDemo,
);

export const Default = createStory<SurroundingOverlayProps>(Template, {});

export const WithDifferentColor = createStory<SurroundingOverlayProps>(
	Template,
	{
		layerColor: 'black',
		padding: 5,
	},
);
