import copyToClipboard = require('copy-to-clipboard');
import * as React from 'react';
import FaClipboard = require('react-icons/lib/fa/clipboard');
import { compose } from 'recompose';
import { TextWithCopyProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { stopEvent, withProps } from '../utils';
import { Box } from './Grid';
import Txt from './Txt';

const Wrapper = withProps<TextWithCopyProps>()(styled(Txt.span))`
	display: inline-block;
	white-space: nowrap;

	.text-with-copy__content {
		white-space: normal;
		word-wrap: break-word;
		margin-right: 3px;
	}

	& > .text-with-copy__copy_wrapper {
		display: inline-block;
	}

	.text-with-copy__copy {
		font-size: 0.875em;
		transform: translateY(-0.08em);
		cursor: pointer;
		visibility: ${props =>
			props.showCopyButton === 'always' ? 'visible' : 'hidden'};
	}

	&:hover .text-with-copy__copy {
		visibility: visible;
	}
`;

const Base = ({ copy, ...props }: TextWithCopyProps) => (
	<Wrapper copy={copy} title={copy} {...props} className="text-with-copy">
		{!!props.children && (
			<span className="text-with-copy__content">{props.children}</span>
		)}

		<span onClick={e => stopEvent(e)} className="text-with-copy__copy_wrapper">
			<Box
				tooltip={{ text: 'Copied!', trigger: 'click' }}
				onClick={() => copyToClipboard((copy || '').trim())}
				className="text-with-copy__copy"
			>
				<FaClipboard />
			</Box>
		</span>
	</Wrapper>
);

export default compose(withTheme, asRendition)(Base);
