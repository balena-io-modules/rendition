import ColorHash from 'color-hash';
import assign from 'lodash/assign';
import memoize from 'lodash/memoize';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../common-types';
import { getColor, px } from '../utils';
import Txt, { TxtProps } from './Txt';

const colorHash = new ColorHash();
const backgroundColor = memoize(
	(text: string): string => {
		return colorHash.hex(text.replace(/\s/g, ''));
	},
);

const BaseBadge = styled(Txt)`
	border-radius: ${props => px(props.theme.radius)};
	display: inline-block;
	min-width: 40px;
	text-align: center;
	font-weight: 800;
	font-style: normal;
	font-stretch: normal;
	letter-spacing: 0.5px;
`;

const Badge = ({
	xsmall,
	small,
	children,
	theme,
	...props
}: ThemedBadgeProps) => {
	let fontSize = 2;
	if (small) {
		fontSize = 1;
	}
	if (xsmall) {
		fontSize = 10;
	}

	if (typeof children !== 'string') {
		throw new Error(
			`The child element of the Badge component must be a string, received: ${typeof children}`,
		);
	}

	return (
		<BaseBadge
			p="2px 5px"
			fontSize={fontSize}
			{...props}
			color={props.color || '#fff'}
			bg={
				getColor(assign(props, { theme }), 'bg', 'main') ||
				backgroundColor(children)
			}
		>
			{children}
		</BaseBadge>
	);
};

export interface InternalBadgeProps extends TxtProps, Coloring {
	small?: boolean;
	xsmall?: boolean;
	color?: string;
	bg?: string;
}

export interface ThemedBadgeProps extends InternalBadgeProps {
	theme: Theme;
}

export type BadgeProps = InternalBadgeProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<BadgeProps>>(
	Badge,
	[],
	['bg', 'color'],
);
