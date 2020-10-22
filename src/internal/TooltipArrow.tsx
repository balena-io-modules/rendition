import * as React from 'react';
import styled from 'styled-components';
import { TooltipPlacement } from '../common-types';

const arrowStyle = `
	position: absolute;
	border: solid;
	border-width: 0 1px 1px 0;
	display: inline-block;
	padding: 3px;
	background-color: white;
`;

const TooltipTopArrow = styled.div`
	${arrowStyle}
	border-color: ${(props: any) => props.theme.colors.gray.main};
	bottom: 2px;
	left: 50%;
	margin-left: -3px;
	transform: rotate(45deg);
`;

const TooltipRightArrow = styled.div`
	${arrowStyle}
	border-color: ${(props: any) => props.theme.colors.gray.main};
	top: 50%;
	left: 2px;
	margin-top: -3px;
	transform: rotate(135deg);
`;

const TooltipLeftArrow = styled.div`
	${arrowStyle}
	border-color: ${(props: any) => props.theme.colors.gray.main};
	top: 50%;
	right: 2px;
	margin-top: -3px;
	transform: rotate(-45deg);
`;

const TooltipBottomArrow = styled.div`
	${arrowStyle}
	border-color: ${(props: any) => props.theme.colors.gray.main};
	top: 2px;
	left: 50%;
	margin-left: -3px;
	transform: rotate(-135deg);
`;

const getArrowElement = (placement?: TooltipPlacement) => {
	switch (placement) {
		case 'right':
			return TooltipRightArrow;
		case 'bottom':
			return TooltipBottomArrow;
		case 'left':
			return TooltipLeftArrow;
		default:
			return TooltipTopArrow;
	}
};

export interface TooltipArrowProps {
	placement?: TooltipPlacement;
}

const TooltipArrow = ({ placement }: TooltipArrowProps) => {
	const ArrowElement = React.useMemo(() => {
		return getArrowElement(placement);
	}, [placement]);

	return <ArrowElement />;
};

export default TooltipArrow;
