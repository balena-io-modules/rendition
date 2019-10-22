import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import styled from 'styled-components';
import defaultStyle from './defaultStyle';

const StyledEditor = styled(SimpleMDE)`
	${defaultStyle};
	/* Make the editor adjust to the container's height*/
	height: 100%;

	.CodeMirror,
	.CodeMirror-scroll {
		/* The minHeight is inline hard-coded in the library to 300px*/
		min-height: 150px !important;
		height: 100%;
	}
`;

export const MarkdownEditor = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (text: string) => void;
}) => {
	return (
		<StyledEditor
			value={value}
			onChange={onChange}
			options={{
				spellChecker: false,
				status: false,
				showIcons: ['code', 'table'],
			}}
		/>
	);
};
