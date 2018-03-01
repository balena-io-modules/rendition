import * as copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import { FaClipboard } from 'react-icons/lib/fa';
import { compose } from 'recompose';
import { CodeWithCopyProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import hoc from '../hoc';
import { stopEvent } from '../utils';
import Button from './Button';

const Wrapper = styled.span`
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
	}
`;

const copyIt = (copy?: string, text?: string) => {
	const copyText = (copy || text || '').trim();

	copyToClipboard(copyText);
};

const Base = ({ copy, text, color, ...props }: CodeWithCopyProps) => {
	return (
		<Wrapper {...props} className="code-with-copy">
			<code title={copy}>{text.trim()}</code>

			<span onClick={e => stopEvent((e as any) as Event)}>
				<Button
					plaintext
					tooltip={{ text: 'Copied!', trigger: 'click' }}
					onClick={() => copyIt(copy, text)}
					className="code-with-copy__copy"
				>
					<FaClipboard color={color as string} />
				</Button>
			</span>
		</Wrapper>
	);
};

export default compose(withTheme, hoc)(Base) as React.ComponentClass<
	CodeWithCopyProps
>;
