import ColorHash from 'color-hash';
import assign from 'lodash/assign';
import memoize from 'lodash/memoize';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../../common-types';
import { getColor, isLight } from '../../utils';
import Txt, { TxtProps } from '../Txt';

const colorHash = new ColorHash();
const backgroundColor = memoize((text: string): string => {
	return colorHash.hex(text.replace(/\s/g, ''));
});

const BaseHighlightedName = styled(Txt.span)`
	font-family: ${props => props.theme.titleFont};
	display: inline-block;
	border-radius: 2px;
	line-height: 1;
	color: ${props => props.color};
`;

const HighlightedName = ({
	children,
	className,
	theme,
	color,
	...props
}: ThemedHighlightedNameProps) => {
	if (typeof children !== 'string') {
		throw new Error(
			`The child element of the HighlightedName component must be a string, received: ${typeof children}`,
		);
	}

	const bgColor =
		getColor(assign(props, { theme }), 'bg', 'main') ||
		backgroundColor(children);

	return (
		<BaseHighlightedName
			{...props}
			className={className}
			p="6px"
			fontSize={0}
			color={color || isLight(bgColor) ? theme.colors.text.main : '#fff'}
			bg={bgColor}
		>
			{children}
		</BaseHighlightedName>
	);
};

export interface InternalHighlightedNameProps extends TxtProps, Coloring {
	children: string;
	className: string;
	color?: string;
	bg?: string;
}

export interface ThemedHighlightedNameProps
	extends InternalHighlightedNameProps {
	theme: Theme;
}

export type HighlightedNameProps = InternalHighlightedNameProps &
	RenditionSystemProps;

export default asRendition<React.FunctionComponent<HighlightedNameProps>>(
	HighlightedName,
	[],
	['bg', 'color'],
);
