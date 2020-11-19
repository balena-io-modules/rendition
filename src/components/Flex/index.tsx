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

/**
 * Displays an element using [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox).
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Flex/Flex.stories.tsx)
 */
export const Flex = styled(Box)<FlexProps>`
	display: flex;
	${flexWrap};
	${flexDirection};
	${alignItems};
	${justifyContent};
`;

Flex.displayName = 'Flex';
