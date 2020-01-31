import Color from 'color';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../../common-types';
import Txt from '../Txt';

// All of the shades are checked so background to text contrast ratio is at least 4:1.
const shades = [
	'#C9DEEE',
	'#CAE1AC',
	'#FDC9EC',
	'#F1CDE3',
	'#D7E4FE',
	'#FFCFCC',
	'#C5E8E6',
	'#D6D3FA',
	'#C3C7CA',
	'#FFDA93',
	'#E1EEE5',
	'#DBE0E3',
	'#FFEC62',
	'#FBE6F4',
	'#FFECAE',
	'#F1CDFF',
	'#C3EFFF',
	'#F3E8FD',
	'#E0FEB4',
	'#FDE8E7',
	'#CAFECD',
];

const getColors = (shade: string) => {
	const base = new Color(shade);
	// The values are derived by trial and error, making sure each pre-defined shades has background to text color ratio of at least 4:1.
	const text = base.darken(0.6).desaturate(0.3);
	return { bg: base.hex(), color: text.hex() };
};

const BaseBadge = styled(Txt.span)`
	font-family: ${props => props.theme.titleFont};
	display: inline-block;
	border-radius: 1em;
	line-height: 1;
`;

const Badge = ({ children, className, shade }: ThemedBadgeProps) => {
	if (typeof children !== 'string') {
		throw new Error(
			`The child element of the Badge component must be a string, received: ${typeof children}`,
		);
	}

	const shadeHex = shades[(shade || 0) % shades.length];

	return (
		<BaseBadge
			className={className}
			py={1}
			px="12px"
			fontSize={0}
			{...getColors(shadeHex)}
		>
			{children}
		</BaseBadge>
	);
};

export interface InternalBadgeProps extends Coloring {
	children: string;
	className?: string;
	shade?: number;
}

export interface ThemedBadgeProps extends InternalBadgeProps {
	theme: Theme;
}

export type BadgeProps = InternalBadgeProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<BadgeProps>>(Badge);
