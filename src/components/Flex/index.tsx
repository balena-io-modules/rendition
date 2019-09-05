import styled from 'styled-components';
import {
	alignItems,
	AlignItemsProps,
	flexDirection,
	FlexDirectionProps,
	flexWrap,
	FlexWrapProps,
	justifyContent,
	JustifyContentProps,
} from 'styled-system';
import { Box, BoxProps } from '../Box';

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
`;

Flex.displayName = 'Flex';
