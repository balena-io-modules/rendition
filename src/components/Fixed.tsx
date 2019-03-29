import defaultTo = require('lodash/defaultTo');
import { compose, withProps } from 'recompose';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps, ResponsiveStyle } from '../common-types';

export interface FixedProps extends DefaultProps {
	top?: boolean | ResponsiveStyle;
	right?: boolean | ResponsiveStyle;
	bottom?: boolean | ResponsiveStyle;
	left?: boolean | ResponsiveStyle;
	z?: ResponsiveStyle;
}

export interface FixedBaseProps extends DefaultProps {
	top?: ResponsiveStyle;
	right?: ResponsiveStyle;
	bottom?: ResponsiveStyle;
	left?: ResponsiveStyle;
	z?: ResponsiveStyle;
}

const Base = (styled.div as StyledFunction<FixedBaseProps>)`
	position: fixed;
	top: ${props => defaultTo(props.top, 'auto')};
	right: ${props => defaultTo(props.right, 'auto')};
	bottom: ${props => defaultTo(props.bottom, 'auto')};
	left: ${props => defaultTo(props.left, 'auto')};
	z-index: ${props => defaultTo(props.z, 0)};
	background: ${props => defaultTo(props.bg, 'none')};
`;

const dimensions = withProps((props: FixedProps) => {
	return {
		top: props.top === true ? 0 : props.top,
		right: props.right === true ? 0 : props.right,
		bottom: props.bottom === true ? 0 : props.bottom,
		left: props.left === true ? 0 : props.left,
	};
});

export default compose<FixedBaseProps, FixedProps>(
	withTheme,
	dimensions,
	asRendition,
)(Base);
