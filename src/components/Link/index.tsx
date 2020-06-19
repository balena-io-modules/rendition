import get from 'lodash/get';
import omit from 'lodash/omit';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps } from '../../common-types';
import { darken, monospace, isExternalUrl, toRelativeUrl } from '../../utils';
import path from 'path';
import { align, bold, caps } from '../Txt';
import { withRouter } from 'react-router-dom';

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

export class RouterLink extends React.Component {
	constructor(props) {
		super(props);

		this.navigate = this.navigate.bind(this);
	}

	makeUrl() {
		const { append, location, to } = this.props;

		if (to) {
			return toRelativeUrl(to);
		}

		if (append) {
			return path.join(location.pathname, append);
		}

		return null;
	}

	navigate(event) {
		const { blank, to } = this.props;

		// If control or meta keys are pressed use default browser behaviour
		if (event.ctrlKey || event.metaKey) {
			return true;
		}

		// If the link is external use default browser behaviour
		if (blank || isExternalUrl(to)) {
			return true;
		}

		event.preventDefault();
		const { history } = this.props;

		const url = this.makeUrl();

		history.push(url);
		return false;
	}

	render() {
		const props = omit(this.props, [
			'match',
			'location',
			'history',
			'to',
			'append',
		]);

		const url = this.makeUrl();

		return (
			<Link
				{...props}
				href={url}
				// We should only navigate when `url` is defined
				onClick={url ? this.navigate : props.onClick}
			/>
		);
	}
}

const Link = ({ is, blank, children, ...props }: InternalLinkProps) => {
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
	is?: React.ElementType;
	decor?: string;
	color?: string;
}

export type LinkProps = InternalLinkProps & RenditionSystemProps;

export default asRendition<React.Component<LinkProps>>(
	withRouter(RouterLink),
	[setDefaultProps],
	['color'],
);
