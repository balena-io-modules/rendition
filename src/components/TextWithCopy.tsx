import copyToClipboard = require('copy-to-clipboard');
import * as React from 'react';
import FaClipboard = require('react-icons/lib/fa/clipboard');
import { compose } from 'recompose';
import { TextWithCopyProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import hoc from '../hoc';
import { stopEvent, withProps } from '../utils';
import Text from './Text';
import Tooltip from './Tooltip';

const Wrapper = withProps<TextWithCopyProps>()(styled(Text.span))`
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
	<Wrapper title={copy} {...props} className="text-with-copy">
		{!!props.children && (
			<span className="text-with-copy__content">{props.children}</span>
		)}

		<span onClick={e => stopEvent(e)} className="text-with-copy__copy_wrapper">
			<Tooltip message="Copied!" eventType="click">
				<div
					onClick={() => copyToClipboard((copy || '').trim())}
					className="text-with-copy__copy"
				>
					<FaClipboard />
				</div>
			</Tooltip>
		</span>
	</Wrapper>
);

export default compose(withTheme, hoc)(Base);
