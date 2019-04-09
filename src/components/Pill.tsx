import * as React from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { Coloring, Shading } from '../common-types';
import { getColor, withProps } from '../utils';
import Txt, { TxtProps } from './Txt';

export interface PillProps extends Coloring, Shading, TxtProps {
	small?: boolean;
	style?: React.CSSProperties;
}

const BasePill = withProps<PillProps>()(styled(Txt))`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px 8px;
	border-radius: 10px;
	font-family: ${props => props.theme.font};
	font-size: 12px;
	font-weight: 500;
	font-style: normal;
	font-stretch: normal;
	line-height: 14px;
	letter-spacing: 0.5px;
	color: #fff;
	background-color: ${props =>
		getColor(props, 'bg', props.shade || 'main') || props.bg || '#7e8085'};
`;

const SmallPill = BasePill.extend`
	padding: 1.4px 5.6px;
	font-size: 8.4px;
	line-height: 11px;
`;

const Pill = ({ small, children, ...props }: PillProps) => {
	const PillComponent = !small ? BasePill : SmallPill;
	return <PillComponent {...props}>{children}</PillComponent>;
};

export default compose(
	withTheme,
	asRendition,
)(Pill) as React.ComponentClass<PillProps>;
