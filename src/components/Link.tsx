import assign = require('lodash/assign');
import get = require('lodash/get');
import omit = require('lodash/omit');
import * as React from 'react';
import { compose, withProps } from 'recompose';
import styled, { StyledFunction } from 'styled-components';
import { color, fontSize, space } from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, Tooltip } from '../common-types';
import { darken, monospace } from '../utils';
import { align, bold, caps } from './Txt';

export interface LinkBaseProps {
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
}

export interface LinkProps extends DefaultProps, Tooltip, LinkBaseProps {}

let Base = (styled.a as StyledFunction<LinkProps>)`
  ${align}
  ${color}
  ${fontSize}
  ${monospace as any};
  ${space}

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

const Link = ({ is, blank, children, ...props }: LinkProps) => {
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

const setDefaultProps = withProps((props: LinkProps) => {
	return assign(
		{
			is: 'a',
			color: `primary.main`,
		},
		props,
	);
});

export default compose(
	setDefaultProps,
	asRendition,
)(Link) as React.ComponentClass<LinkProps>;
