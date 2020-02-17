import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../../common-types';
import { getLegibleTextColor } from '../../utils';
import Txt from '../Txt';

// All of the shades are checked so background to text contrast ratio is at least 4:1.
const shades = [
	'#C7FFFF',
	'#BAECC2',
	'#FFD4F1',
	'#F1CDE3',
	'#D7E4FE',
	'#FFD5D2',
	'#CAE1AC',
	'#D6D3FA',
	'#C3C7CA',
	'#FFDA93',
	'#E1EEE5',
	'#DBE0E3',
	'#FEEC63',
	'#FBE6F4',
	'#FFECAE',
	'#F1CDFF',
	'#C3EFFF',
	'#F3E8FD',
	'#E0FEB4',
	'#FDE8E7',
	'#CAFECD',
	'#D7E46C',
	'#F7D8BA',
];

const BaseBadge = styled(Txt.span)`
	font-family: ${props => props.theme.titleFont};
	display: inline-block;
	border-radius: 1em;
	line-height: 1;
`;

const Badge = ({
	children,
	className,
	shade,
	...otherProps
}: ThemedBadgeProps) => {
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
			bg={shadeHex}
			{...otherProps}
			color={getLegibleTextColor(shadeHex)}
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
