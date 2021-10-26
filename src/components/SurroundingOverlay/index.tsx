import React from 'react';
import styled from 'styled-components';

interface LayerProps {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
	height?: number;
	layerColor?: string;
	opacity?: number;
}

const Layer = styled.div<LayerProps>`
	position: absolute;
	z-index: 20;
	${(props) => `
		opacity: ${props.opacity ?? 0.5};
    background: ${props.layerColor || 'white'};
    top: ${props.top || 0}px;
    bottom: ${props.bottom || 0}px;
    left: ${props.left || 0}px;
    right: ${props.right || 0}px;
    height: ${props.height != null ? props.height + 'px' : 'auto'};
  `}
`;

export type PartialDomRect = Partial<Omit<DOMRect, 'toJSON'>>;

export const getBoundingContainerRect = (
	element: EventTarget & HTMLDivElement,
): PartialDomRect | null => {
	if (!element) {
		return null;
	}
	const parent = (element.offsetParent as HTMLElement) ?? document.body;
	const top = element.offsetTop + parent.offsetTop;
	const left = element.offsetLeft + parent.offsetLeft;
	const height = element.clientHeight;
	return {
		top,
		bottom: top + height,
		left,
		right: left + element.clientWidth,
		height,
		width: element.clientWidth,
		x: top,
		y: left,
	};
};

export interface SurroundingOverlayProps {
	rect: PartialDomRect | null;
	layerColor?: string;
	padding?: number;
	opacity?: number;
}

export const SurroundingOverlay = ({
	rect,
	layerColor,
	padding = 0,
	opacity,
}: SurroundingOverlayProps) => {
	if (!rect) {
		return null;
	}

	const top = rect.top ?? 0;
	const left = rect.left ?? 0;
	const height = rect.height ?? 0;
	const width = rect.width ?? 0;

	const topDistance = top + height + padding;
	const lateralLayersTop = Math.max(top - padding, 0);
	const lateralLayersRight = left + width + padding;
	const lateralLayersHeight = topDistance - lateralLayersTop;

	const layers = {
		topLayer: {
			height: lateralLayersTop,
		},
		bottomLayer: {
			top: topDistance,
		},
		rightLayer: {
			top: lateralLayersTop,
			left: lateralLayersRight,
			height: lateralLayersHeight,
		},
		leftLayer: {
			top: lateralLayersTop,
			right: lateralLayersRight,
			height: lateralLayersHeight,
		},
	};

	return (
		<>
			{Object.values(layers).map((layerProps, index) => (
				<Layer
					key={index}
					{...layerProps}
					layerColor={layerColor}
					opacity={opacity}
				/>
			))}
		</>
	);
};
