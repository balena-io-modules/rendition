import assign = require('lodash/assign');
import get = require('lodash/get');
import omit = require('lodash/omit');
import * as React from 'react';
import { compose, withProps } from 'recompose';
import { LinkProps } from 'rendition';
import styled, { StyledFunction } from 'styled-components';
import { color, fontSize, space } from 'styled-system';
import asRendition from '../asRendition';
import { darken, monospace } from '../utils';
import { align, bold, caps } from './Txt';

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

const Link = ({ is, blank, ...props }: LinkProps) => {
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
		/>
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

export default compose(setDefaultProps, asRendition)(
	Link,
) as React.ComponentClass<LinkProps>;
