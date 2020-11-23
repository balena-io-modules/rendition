import get from 'lodash/get';
import omit from 'lodash/omit';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { darken, monospace } from '../../utils';
import { align, bold, caps } from '../Txt';

const Base = styled.a<InternalLinkProps>`
	${align}
	${monospace};
	${caps}
	${bold}

  text-decoration: ${(props) => props.decor || 'none'};
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	opacity: ${(props) => (props.disabled ? 0.65 : 1)};
	display: inline-block;

	&:active,
	&:hover {
		color: ${(props) =>
			!props.disabled &&
			(darken(
				get(props.theme.colors, props.color as any) || props.color,
			) as any)};
	}
`;

const BaseLink = ({ is, blank, children, ...props }: InternalLinkProps) => {
	if (props.disabled) {
		props = omit(props, 'href');
	}
	return (
		<Base
			{...props}
			as={is}
			rel={blank ? 'noopener' : undefined}
			target={blank ? '_blank' : undefined}
		>
			{children || props.href}
		</Base>
	);
};

const setDefaultProps = withProps((props: InternalLinkProps) => {
	return Object.assign(
		{
			color: `primary.main`,
		},
		props,
	);
});

export interface InternalLinkProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'is'> {
	/** If true, open the link in a new tab */
	blank?: boolean;
	/** If true, disable the link */
	disabled?: boolean;
	download?: any;
	href?: string;
	hrefLang?: string;
	media?: string;
	rel?: string;
	target?: string;
	type?: string;
	is?: React.ElementType;
	decor?: string;
	color?: string;
}

export type LinkProps = InternalLinkProps & RenditionSystemProps;

/**
 * Displays an anchor link.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Link/Link.stories.tsx)
 */
export const Link = asRendition<React.FunctionComponent<LinkProps>>(
	BaseLink,
	[setDefaultProps],
	['color'],
);
