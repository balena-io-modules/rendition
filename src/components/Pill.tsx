import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { Coloring, EnhancedType, Shading } from '../common-types';
import { getColor } from '../utils';
import Txt, { TxtProps } from './Txt';

export interface PillProps extends Coloring, Shading, TxtProps {
	small?: boolean;
	style?: React.CSSProperties;
}

const BasePill = styled(Txt)<PillProps>`
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
` as React.ComponentType<EnhancedType<PillProps>>;

const SmallPill = styled(BasePill)`
	padding: 1.4px 5.6px;
	font-size: 8.4px;
	line-height: 11px;
` as React.ComponentType<EnhancedType<PillProps>>;

const Pill = ({ small, children, ...props }: PillProps) => {
	const PillComponent = !small ? BasePill : SmallPill;
	return <PillComponent {...props}>{children}</PillComponent>;
};

export default asRendition<PillProps>(Pill);
