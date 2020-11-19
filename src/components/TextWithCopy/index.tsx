import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';
import { Txt, TxtProps } from '../Txt';

const Wrapper = styled(Txt.span)<InternalTextWithCopyProps>`
	display: inline-block;
	white-space: ${(props) => (props.code ? 'initial' : 'nowrap')};

	.text-with-copy__content {
		white-space: normal;
		word-wrap: break-word;
		margin-right: ${(props) => px(props.theme.space[1])};
	}

	& > .text-with-copy__copy_wrapper {
		display: inline-block;
	}

	.text-with-copy__copy {
		cursor: pointer;
		visibility: ${(props) =>
			props.showCopyButton === 'always' ? 'visible' : 'hidden'};
	}

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

	&:hover .text-with-copy__copy {
		visibility: visible;
	}
`;

const BaseTextWithCopy = ({
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
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
				}}
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
export const TextWithCopy = asRendition<
	React.FunctionComponent<TextWithCopyProps>
>(BaseTextWithCopy);
