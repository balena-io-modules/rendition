import ColorHash = require('color-hash');
import assign = require('lodash/assign');
import memoize = require('lodash/memoize');
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { Coloring, EnhancedType, Theme } from '../common-types';
import { getColor, px } from '../utils';
import { Box, BoxProps } from './Grid';

export interface BadgeProps extends BoxProps, Coloring {
	text: string;
	small?: boolean;
	color?: string;
	bg?: string;
}

const colorHash = new ColorHash();
const backgroundColor = memoize((text: string): string => colorHash.hex(text));

export interface ThemedBadgeProps extends BadgeProps {
	theme: Theme;
}

const BaseBadge = styled(Box)`
	border-radius: ${props => px(props.theme.radius)};
	display: inline-block;
	min-width: 40px;
	text-align: center;
` as React.ComponentType<EnhancedType<BoxProps>>;

const Badge = ({ small, text, theme, ...props }: ThemedBadgeProps) => {
	return (
		<BaseBadge
			p="3px 5px"
			fontSize={small ? 13 : 18}
			{...props}
			color={props.color || '#fff'}
			bg={
				getColor(assign(props, { theme }), 'bg', 'main') ||
				backgroundColor(text)
			}
		>
			{text}
		</BaseBadge>
	);
};

export default asRendition<BadgeProps>(Badge, [], ['bg', 'color']);
