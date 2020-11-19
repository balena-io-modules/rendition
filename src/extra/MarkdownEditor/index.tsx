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

export interface MarkdownEditorProps {
	/** The markdown-flavored text */
	value: string;
	/** Callback called on every content change */
	onChange: (text: string) => void;
}

/**
 * A markdown editor based on [simple MDE editor](https://github.com/RIP21/react-simplemde-editor)
 *
 * ```
 * import { MarkdownEditor } from 'rendition/dist/extra/MarkdownEditor';
 * ```
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/extra/MarkdownEditor/MarkdownEditor.stories.tsx)
 */
export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
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
