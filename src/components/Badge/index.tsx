import Color from 'color';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../../common-types';
import Txt from '../Txt';

const shades = [
	'#B3D2E5',
	'#BAECC2',
	'#FDC7EB',
	'#E5C7EA',
	'#BCE6F5',
	'#FCB9B6',
	'#B6E3DF',
	'#D6D3FA',
	'#C3C7CA',
	'#FBDBB2',
	'#E1E3B9',
	'#DBE0E3',
	'#ffef62',
	'#fbe6f4',
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
