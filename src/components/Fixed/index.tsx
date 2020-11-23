import defaultTo from 'lodash/defaultTo';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps, ResponsiveStyle } from '../../common-types';

const Base = styled.div<FixedBaseProps>`
	position: fixed;
	top: ${(props) => defaultTo(props.top, 'auto')};
	right: ${(props) => defaultTo(props.right, 'auto')};
	bottom: ${(props) => defaultTo(props.bottom, 'auto')};
	left: ${(props) => defaultTo(props.left, 'auto')};
	z-index: ${(props) => defaultTo(props.z, 0)};
	background: ${(props) => defaultTo(props.bg, 'none')};
`;

const dimensions = withProps((props: FixedProps) => {
	return {
		top: props.top === true ? 0 : props.top,
		right: props.right === true ? 0 : props.right,
		bottom: props.bottom === true ? 0 : props.bottom,
		left: props.left === true ? 0 : props.left,
	};
});

interface FixedBaseProps extends React.HTMLAttributes<HTMLElement> {
	top?: ResponsiveStyle;
	right?: ResponsiveStyle;
	bottom?: ResponsiveStyle;
	left?: ResponsiveStyle;
	z?: ResponsiveStyle;
	bg?: string;
}

export interface InternalFixedProps extends React.HTMLAttributes<HTMLElement> {
	/** Sets the distance to the top of the containing block. If true, sets the value to zero */
	top?: boolean | ResponsiveStyle;
	/** Sets the distance to the right of the containing block. If true, sets the value to zero */
	right?: boolean | ResponsiveStyle;
	/** Sets the distance to the bottom of the containing block. If true, sets the value to zero */
	bottom?: boolean | ResponsiveStyle;
	/** Sets the distance to the left of the containing block. If true, sets the value to zero */
	left?: boolean | ResponsiveStyle;
	/** Sets the z-index of the component */
	z?: ResponsiveStyle;
	bg?: string;
}

export type FixedProps = InternalFixedProps & RenditionSystemProps;

/**
 * Displays an element with a [fixed](https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed) position.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Fixed/Fixed.stories.tsx)
 */
export const Fixed = asRendition<
	React.ForwardRefExoticComponent<
		FixedProps & React.RefAttributes<HTMLDivElement>
	>
>(Base, [dimensions], ['bg']);
