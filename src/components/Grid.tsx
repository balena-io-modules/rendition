import { RefObject } from 'react';
import styled from 'styled-components';
import {
	alignItems,
	AlignItemsProps,
	alignSelf,
	AlignSelfProps,
	flex,
	flexDirection,
	FlexDirectionProps,
	FlexProps as StyledFlexProps,
	flexWrap,
	FlexWrapProps,
	justifyContent,
	JustifyContentProps,
	order,
	OrderProps,
} from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, EnhancedType } from '../common-types';

export interface BoxProps
	extends DefaultProps,
		StyledFlexProps,
		OrderProps,
		AlignSelfProps {
	ref?:
		| string
		| ((instance: any | null) => void)
		| RefObject<any>
		| null
		| undefined;
}
export const Box = asRendition<BoxProps>(
	styled.div<BoxProps>`
		box-sizing: border-box;
		${flex};
		${order};
		${alignSelf};
	`,
);

Box.displayName = 'Box';

export interface FlexProps
	extends BoxProps,
		FlexWrapProps,
		FlexDirectionProps,
		AlignItemsProps,
		JustifyContentProps {}

export const Flex = styled(Box)<FlexProps>`
	display: flex;
	${flexWrap};
	${flexDirection};
	${alignItems};
	${justifyContent};
` as React.ComponentType<EnhancedType<FlexProps>>;

Flex.displayName = 'Flex';
