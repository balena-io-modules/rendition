import copyToClipboard = require('copy-to-clipboard');
import * as React from 'react';
import FaClipboard = require('react-icons/lib/fa/clipboard');
import styled from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps, EnhancedType } from '../common-types';
import { stopEvent } from '../utils';
import { Box } from './Grid';
import Txt, { TxtProps } from './Txt';

export interface TextWithCopyProps extends DefaultProps, TxtProps {
	copy: string;
	showCopyButton?: 'hover' | 'always';
}

const Wrapper = styled(Txt.span)<TextWithCopyProps>`
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
` as React.ComponentType<EnhancedType<TextWithCopyProps>>;

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

export default asRendition<TextWithCopyProps>(Base);
