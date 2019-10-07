import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps } from '../../common-types';
import { px, stopEvent } from '../../utils';
import { Box } from '../Box';
import Txt, { TxtProps } from '../Txt';

const Wrapper = styled(Txt.span)<InternalTextWithCopyProps>`
	display: inline-block;
	white-space: ${props => (props.code ? 'initial' : 'nowrap')};

	.text-with-copy__content {
		white-space: normal;
		word-wrap: break-word;
		margin-right: ${props => px(props.theme.space[1])};
	}

	& > .text-with-copy__copy_wrapper {
		display: inline-block;
	}

	.text-with-copy__copy {
		cursor: pointer;
		visibility: ${props =>
			props.showCopyButton === 'always' ? 'visible' : 'hidden'};
	}

	code {
		font-family: ${props => props.theme.monospace};
		padding: 2px 4px;
		font-size: 90%;
		color: #c7254e;
		background-color: #f9f2f4;
		border-radius: 2px;
		white-space: normal;
		word-wrap: break-word;
		font-size: 1em;
		margin-right: ${props => px(props.theme.space[1])};
		display: inline-block;
	}

	&:hover .text-with-copy__copy {
		visibility: visible;
	}
`;

const Base = ({
	copy,
	code,
	text,
	children,
	...props
}: InternalTextWithCopyProps) => {
	const normalizedText = (text || '').toString().trim();
	const normalizedCopy = (copy || normalizedText).toString().trim();
	const contentToRender = children || normalizedText || normalizedCopy;

	return (
		<Wrapper copy={copy} title={copy} {...props} className="text-with-copy">
			{!code && (
				<span className="text-with-copy__content">{contentToRender}</span>
			)}

			{code && <code title={normalizedCopy}>{contentToRender}</code>}

			<span
				onClick={e => stopEvent(e)}
				className="text-with-copy__copy_wrapper"
			>
				<Box
					tooltip={{ text: 'Copied!', trigger: 'click' }}
					onClick={() => copyToClipboard(normalizedCopy)}
					className="text-with-copy__copy"
				>
					<FontAwesomeIcon icon={faCopy} />
				</Box>
			</span>
		</Wrapper>
	);
};

export interface InternalTextWithCopyProps extends DefaultProps, TxtProps {
	copy: string;
	showCopyButton?: 'hover' | 'always';
	code?: boolean;
	text?: string;
}

export type TextWithCopyProps = InternalTextWithCopyProps &
	RenditionSystemProps;

export default asRendition<React.FunctionComponent<TextWithCopyProps>>(Base);
