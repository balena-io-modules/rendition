import React from 'react';
import { Meta } from '@storybook/react';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createTemplate, createStory } from '../../stories/utils';
import { Button } from '../Button';
import { ButtonGroup, ButtonGroupProps, OptionType } from '.';

export default {
	title: 'Core/ButtonGroup',
	component: ButtonGroup,
	subcomponents: { Button },
} as Meta;

const OptionsDemoTemplate = (props: ButtonGroupProps) => {
	if (!('options' in props)) {
		return null;
	}

	if (typeof props.value !== 'object') {
		return null;
	}

	const [selected, setSelected] = React.useState<OptionType>(props.value);

	return (
		<ButtonGroup
			{...props}
			options={props.options}
			onGroupChange={setSelected}
			value={selected}
		/>
	);
};

const Template = createTemplate<ButtonGroupProps>(ButtonGroup);
const OptionsTemplate = createTemplate<ButtonGroupProps>(OptionsDemoTemplate);

export const Default = createStory<ButtonGroupProps>(Template, {
	children: (
		<>
			<Button>First</Button>
			<Button>Second</Button>
			<Button>Third</Button>
		</>
	),
});

export const GroupSelect = createStory<ButtonGroupProps>(OptionsTemplate, {
	options: ['option1', 'option2', 'option3'],
	value: 'option2',
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
