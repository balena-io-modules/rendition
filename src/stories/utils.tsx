import React from 'react';
import { Story } from '@storybook/react';

export const createTemplate = <T extends object>(
	Component: React.FunctionComponent<T> | React.ComponentClass<T>,
) => {
	return (args: T) => {
		return <Component {...args} />;
	};
};

export const createStory = <T extends object>(
	template: Story<T>,
	args: object,
) => {
	const res: Story<T> = template.bind({});
	res.args = args;
	return res;
};
