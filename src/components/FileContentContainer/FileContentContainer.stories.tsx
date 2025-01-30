import * as React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { FileContentContainer, FileContentContainerProps } from './';

export default {
	title: 'Core/FileContentContainer',
	component: FileContentContainer,
	decorators: [
		(Story) => (
			<div style={{ width: 400, height: 400 }}>
				<Story />
			</div>
		),
	],
} as Meta;

const Template =
	createTemplate<FileContentContainerProps>(FileContentContainer);

// I'll see if this is the best example text to use
export const Default = createStory<FileContentContainerProps>(Template, {
	children: `FROM show/some/example/code

    RUN some example formatted code
    
    Lorem ipsum dolor sit amet,
       
    consectetur adipiscing elit.
    
    Nam scelerisque euismod risus at gravida.
    
    Pellentesque a nunc semper,
    
    ultrices lacus nec, mattis mauris

    `,
});
