import ColorHash = require('color-hash');
import assign = require('lodash/assign');
import memoize = require('lodash/memoize');
import * as React from 'react';
import { BadgeProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { getColor, px } from '../utils';
import { Box } from './Grid';

const colorHash = new ColorHash();
const backgroundColor = memoize((text: string): string => colorHash.hex(text));

interface ThemedBadgeProps extends BadgeProps {
	theme: Theme;
}

const BaseBadge = styled(Box)`
	border-radius: ${props => px(props.theme.radius)};
	display: inline-block;
	min-width: 40px;
	text-align: center;
`;

export default withTheme(
	asRendition(({ small, text, theme, ...props }: ThemedBadgeProps) => {
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
	}),
) as React.ComponentClass<BadgeProps>;
