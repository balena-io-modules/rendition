import assign = require('lodash/assign');
import get = require('lodash/get');
import omit = require('lodash/omit');
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps, RenditionSystemProps } from '../common-types';
import { darken, monospace } from '../utils';
import { align, bold, caps } from './Txt';

let Base = styled.a<InternalLinkProps>`
  ${align}
  ${monospace as any};
  ${caps as any}
  ${bold as any}

  text-decoration: ${props => props.decor || 'none'};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.65 : 1)};
  display: inline-block;

  &:active,
  &:hover {
    color: ${props =>
			!props.disabled &&
			(darken(
				get(props.theme.colors, props.color as any) || props.color,
			) as any)};
  }
`;

const Link = ({ is, blank, children, ...props }: InternalLinkProps) => {
	if (is) {
		Base = Base.withComponent(is as any);
	}
	if (props.disabled) {
		props = omit(props, 'href');
	}
	return (
		<Base
			{...props}
			rel={blank ? 'noopener' : undefined}
			target={blank ? '_blank' : undefined}
		>
			{children || props.href}
		</Base>
	);
};

const setDefaultProps = withProps((props: InternalLinkProps) => {
	return assign(
		{
			color: `primary.main`,
		},
		props,
	);
});

export interface InternalLinkProps extends DefaultProps {
	blank?: boolean;
	disabled?: boolean;
	download?: any;
	href?: string;
	hrefLang?: string;
	media?: string;
	rel?: string;
	target?: string;
	type?: string;
	is?: string;
	decor?: string;
	color?: string;
}

export type LinkProps = InternalLinkProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<LinkProps>>(
	Link,
	[setDefaultProps],
	['color'],
);
