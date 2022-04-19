import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Box, BoxProps } from '../Box';

const ClipboardContainer = styled(Box)`
	cursor: pointer;
	font-size: 0.875em;
`;

const CopyContainer = styled(Box)<{ show: InternalCopyProps['show'] }>`
	display: inline-flex;
	align-items: center;
	${ClipboardContainer} {
		visibility: ${(props) => (props.show === 'always' ? 'visible' : 'hidden')};
		svg {
			margin: ${(props) => `0 ${px(props.theme.space[1])}`};
		}
	}

	&:hover {
		${ClipboardContainer} {
			visibility: visible;
		}
	}
`;

const BaseCopy = ({
	content,
	show,
	children,
	onClick,
	onCopy,
	...otherProps
}: InternalCopyProps) => {
	const normalizedText = (content || '').toString().trim();

	return (
		<CopyContainer show={!!children ? show : 'always'} {...otherProps}>
			{children}
			<ClipboardContainer
				tooltip={{ text: 'Copied!', trigger: 'click' }}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					copyToClipboard(normalizedText);
					if (onClick) {
						onClick(normalizedText);
					}
					onCopy?.(e);
				}}
			>
				<FontAwesomeIcon icon={faCopy} />
			</ClipboardContainer>
		</CopyContainer>
	);
};

interface InternalCopyProps extends Omit<BoxProps, 'onClick' | 'onCopy'> {
	/** The value that should be copied to the clipboard */
	content: string | number;
	/** Optionally show the copy button on hover or always show the button */
	show?: 'hover' | 'always';
	/** onClick handler, useful if you wish to do other actions after content was copied */
	onClick?: (content: string) => void;
	/** The content next to which the clipboard button should be shown */
	children?: React.ReactNode;
	/** Calls the given function when the copy icon is clicked */
	onCopy?: React.MouseEventHandler<HTMLElement>;
}

export type CopyProps = InternalCopyProps & RenditionSystemProps;

/**
 * Wrapper that adds a "copy to clipboard" button to any component and copies the passed content to the user's clipboard.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Copy/Copy.stories.tsx)
 */
export const Copy = BaseCopy;
