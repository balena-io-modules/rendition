import React from 'react';
import { Meta } from '@storybook/react';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createTemplate, createStory } from '../../stories/utils';
import { Button } from '../Button';
import { ButtonGroup, ButtonGroupProps } from '.';

export default {
	title: 'Core/ButtonGroup',
	component: ButtonGroup,
	subcomponents: { Button },
} as Meta;

const Template = createTemplate<ButtonGroupProps>(ButtonGroup);

export const Default = createStory<ButtonGroupProps>(Template, {
	children: (
		<>
			<Button>First</Button>
			<Button>Second</Button>
			<Button>Third</Button>
		</>
	),
});

export const WithIconButton = createStory<ButtonGroupProps>(Template, {
	children: (
		<>
			<Button icon={<FontAwesomeIcon fixedWidth icon={faExpand} />} />
			<Button icon={<FontAwesomeIcon fixedWidth icon={faRecycle} />} />
			<Button icon={<FontAwesomeIcon fixedWidth icon={faSpinner} />} />
		</>
	),
});
