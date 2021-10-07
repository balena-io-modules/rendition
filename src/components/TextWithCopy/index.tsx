import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px, stopEvent } from '../../utils';
import { Box } from '../Box';
import { Txt, TxtProps } from '../Txt';

const Wrapper = styled(Txt.span)<InternalTextWithCopyProps>`
	display: inline-block;
	white-space: ${(props) => (props.code ? 'initial' : 'nowrap')};

	code {
		font-family: ${(props) => props.theme.monospace};
		padding: 2px 4px;
		font-size: 90%;
		color: #c7254e;
		background-color: #f9f2f4;
		border-radius: 2px;
		white-space: normal;
		word-wrap: break-word;
		font-size: 1em;
		margin-right: ${(props) => px(props.theme.space[1])};
		display: inline-block;
	}
`;

const Content = styled.span`
	white-space: normal;
	word-wrap: break-word;
	margin-right: ${(props) => px(props.theme.space[1])};
`;

const Copy = styled(Box)<{ showCopyButton: 'always' | 'hover' | undefined }>`
	cursor: pointer;
	visibility: ${(props) =>
		props.showCopyButton === 'always' ? 'visible' : 'hidden'};
	&:hover {
		visibility: visible;
	}
`;

const CopyWrapper = styled.span`
	display: inline-block;
`;

const BaseTextWithCopy = ({
	copy,
	code,
	text,
	children,
	showCopyButton,
}: InternalTextWithCopyProps) => {
	const normalizedText = (text || '').toString().trim();
	const normalizedCopy = (copy || normalizedText).toString().trim();
	const contentToRender = children || normalizedText || normalizedCopy;

	return (
		<Wrapper copy={copy} title={copy}>
			{!code && <Content>{contentToRender}</Content>}

			{code && <code title={normalizedCopy}>{contentToRender}</code>}

			<CopyWrapper onClick={stopEvent}>
				<Copy
					tooltip={{ text: 'Copied!', trigger: 'click' }}
					onClick={() => copyToClipboard(normalizedCopy)}
					showCopyButton={showCopyButton}
				>
					<FontAwesomeIcon icon={faCopy} />
				</Copy>
			</CopyWrapper>
		</Wrapper>
	);
};

export interface InternalTextWithCopyProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
		TxtProps {
	/** The value that should be copied to the clipboard */
	copy: string;
	/** Optionally show the copy button on hover or always show the button */
	showCopyButton?: 'hover' | 'always';
	code?: boolean;
	text?: string;
}

export type TextWithCopyProps = InternalTextWithCopyProps &
	RenditionSystemProps;

/**
 * Displays text that can be copied to the clipboard.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/TextWithCopy/TextWithCopy.stories.tsx)
 */
export const TextWithCopy =
	asRendition<React.FunctionComponent<TextWithCopyProps>>(BaseTextWithCopy);
