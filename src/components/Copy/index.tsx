import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';
import { Flex, FlexProps } from '../Flex';

const ClipboardContainer = styled(Box)`
	cursor: pointer;
	/* We want the clipboard icon slightly smaller, but it should be the same height as normal text so it lines up nicely */
	font-size: 0.875em;
	line-height: ${(props) =>
		px(props.theme.lineHeight * props.theme.fontSizes[2])};
`;

const CopyContainer = styled(Flex)<{
	show: InternalCopyProps['show'];
}>`
	${ClipboardContainer} {
		display: ${(props) => (props.show === 'always' ? 'inline' : 'none')};
	}

	&:hover {
		${ClipboardContainer} {
			display: inline;
		}
	}
`;

const BaseCopy = ({
	content,
	show,
	children,
	onClick,
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
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					copyToClipboard(normalizedText);
					if (onClick) {
						onClick(normalizedText);
					}
				}}
			>
				<FontAwesomeIcon icon={faCopy} />
			</ClipboardContainer>
		</CopyContainer>
	);
};

interface InternalCopyProps extends Omit<FlexProps, 'onClick'> {
	/** The value that should be copied to the clipboard */
	content: string;
	/** Optionally show the copy button on hover or always show the button */
	show?: 'hover' | 'always';
	/** onClick handler, useful if you wish to do other actions after content was copied */
	onClick?: (content: string) => void;
	/** The content next to which the clipboard button should be shown */
	children?: React.ReactNode;
}

export type CopyProps = InternalCopyProps & RenditionSystemProps;

/**
 * Wrapper that adds a "copy to clipboard" button to any component and copies the passed content to the user's clipboard.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Copy/Copy.stories.tsx)
 */
export const Copy = BaseCopy;
