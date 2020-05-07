import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { Coloring, RenditionSystemProps, Theme } from '../../common-types';
import { generateColorFromString, getColor, isLight } from '../../utils';
import Txt, { TxtProps } from '../Txt';

const BaseHighlightedName = styled(Txt.span)`
	font-family: ${(props) => props.theme.titleFont};
	display: inline-block;
	border-radius: 2px;
	line-height: 1;
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
		getColor(Object.assign(props, { theme }), 'bg', 'main') ||
		generateColorFromString(children);

	return (
		<BaseHighlightedName
			{...props}
			className={className}
			p={2}
			fontSize={1}
			color={color || isLight(bgColor) ? theme.colors.text.main : '#fff'}
			bg={bgColor}
		>
			{children}
		</BaseHighlightedName>
	);
};

export interface InternalHighlightedNameProps extends TxtProps, Coloring {
	children: string;
	className?: string;
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
