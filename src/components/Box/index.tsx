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
import { RenditionSystemProps } from '../../common-types';

export interface BoxProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
		StyledFlexProps,
		OrderProps,
		AlignSelfProps,
		RenditionSystemProps {}

/**
 * Displays a block level element. The basic building block of a rendition application.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Box/Box.stories.tsx)
 */
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
