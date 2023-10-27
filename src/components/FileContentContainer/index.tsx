import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
// now import some components it builds on

const ComposeContainer = styled.pre`
	background: none;
	color: inherit;
	border: 0;
	margin: 0;
	padding: 0;
	font-size: inherit;
	white-space: pre-wrap;
`;

/*const FileContentContainerBase = ()=> {
    return (
        <ComposeContainer></ComposeContainer>
    );
};*/
// note: this should be good for now. See how it looks with <Box>
const FileContentContainerBase = ({
	children,
}: InternalContentContainerProps) => {
	const Body = children;
	return <ComposeContainer>{Body}</ComposeContainer>;
};

export interface InternalContentContainerProps {
	children?: string;
}

export type FileContentContainerProps = InternalContentContainerProps &
	RenditionSystemProps;

export const FileContentContainer = asRendition<
	React.FunctionComponent<FileContentContainerProps>
>(FileContentContainerBase);
