import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import FaClipboard from 'react-icons/lib/fa/clipboard';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';
import { px, stopEvent } from '../../utils';
import { Box } from '../Box';
import { Flex, FlexProps } from '../Flex';

const ClipboardContainer = styled(Box)`
	cursor: pointer;
	/* We want the clipboard icon slightly smaller, but it should be the same height as normal text so it lines up nicely */
	font-size: 0.875em;
	line-height: ${props => px(props.theme.lineHeight * props.theme.font[1])};
`;

const CopyContainer = styled(Flex)<{
	show: InternalCopyProps['show'];
}>`
	${ClipboardContainer} {
		display: ${props => (props.show === 'always' ? 'inline' : 'none')};
	}

	&:hover {
		${ClipboardContainer} {
			display: inline;
		}
	}
`;

export default ({
	content,
	show,
	children,
	...otherProps
}: InternalCopyProps) => {
	const normalizedText = (content || '').toString().trim();

	return (
		<CopyContainer
			show={!!children ? show : 'always'}
			flexDirection="row"
			flexWrap="nowrap"
			{...otherProps}
		>
			{children}
			<ClipboardContainer
				mx={2}
				tooltip={{ text: 'Copied!', trigger: 'click' }}
				onClick={e => {
					stopEvent(e);
					copyToClipboard(normalizedText);
				}}
			>
				<FaClipboard />
			</ClipboardContainer>
		</CopyContainer>
	);
};

export interface InternalCopyProps extends FlexProps {
	content: string;
	show?: 'hover' | 'always';
	children: React.ReactNode;
}

export type CopyProps = InternalCopyProps & RenditionSystemProps;
