import * as copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import { FaClipboard } from 'react-icons/lib/fa';
import { compose } from 'recompose';
import { CodeWithCopyProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { stopEvent, withProps } from '../utils';
import Button from './Button';
import Txt from './Txt';

const Wrapper = withProps<Partial<CodeWithCopyProps>>()(styled(Txt.span))`
	white-space: initial;

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
		margin-right: 3px;
	}

	.code-with-copy__copy {
		.text-selection--none;
		cursor: pointer;
		visibility: ${props =>
			props.showCopyButton
				? props.showCopyButton === 'always'
					? 'visible'
					: 'hidden'
				: 'visible'};
	}

	&:hover .code-with-copy__copy {
		visibility: visible;
	}
`;

const Base = ({ copy, text, color, ...props }: CodeWithCopyProps) => {
	const normalizedText = (text || '').toString().trim();
	const normalizedCopy = (copy || normalizedText).toString().trim();

	return (
		<Wrapper {...props} className="code-with-copy">
			<code title={normalizedCopy}>{normalizedText || normalizedCopy}</code>

			<span onClick={e => stopEvent((e as any) as Event)}>
				<Button
					plaintext
					tooltip={{ text: 'Copied!', trigger: 'click' }}
					onClick={() => copyToClipboard(normalizedCopy)}
					className="code-with-copy__copy"
				>
					<FaClipboard color={color as string} />
				</Button>
			</span>
		</Wrapper>
	);
};

export default compose(withTheme, asRendition)(Base) as React.ComponentClass<
	CodeWithCopyProps
>;
