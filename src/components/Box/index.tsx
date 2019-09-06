import styled from 'styled-components';
import {
	alignSelf,
	AlignSelfProps,
	flex,
	FlexProps as StyledFlexProps,
	order,
	OrderProps,
} from 'styled-system';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps } from '../../common-types';

export interface BoxProps
	extends DefaultProps,
		StyledFlexProps,
		OrderProps,
		AlignSelfProps,
		RenditionSystemProps {}

export const Box = asRendition<
	React.ForwardRefExoticComponent<
		BoxProps & React.RefAttributes<HTMLDivElement>
	>
>(
	styled.div<BoxProps>`
		box-sizing: border-box;
		${flex};
		${order};
		${alignSelf};
	`,
);

Box.displayName = 'Box';
