import isString from 'lodash/isString';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import * as React from 'react';
import * as shortid from 'shortid';
import styled from 'styled-components';
import { TooltipPlacement } from './common-types';

// The distance between the tooltip arrow and the target element
const TARGET_OFFSET = 3;

// The time in ms to show a tooltip after being triggered by a click event
const CLICK_TIMEOUT = 1000;

const arrowStyle = `
	position: absolute;
	width: 0;
	height: 0;
	border-color: transparent;
	border-style: solid;
`;

const TooltipTopArrow = styled.div`
	${arrowStyle} bottom: 0;
	left: 50%;
	margin-left: -5px;
	border-width: 5px 5px 0;
	border-top-color: #000;
`;

const TooltipRightArrow = styled.div`
	${arrowStyle} top: 50%;
	left: 0;
	margin-top: -5px;
	border-width: 5px 5px 5px 0;
	border-right-color: #000;
`;

const TooltipLeftArrow = styled.div`
	${arrowStyle} top: 50%;
	right: 0;
	margin-top: -5px;
	border-width: 5px 0 5px 5px;
	border-left-color: #000;
`;

const TooltipBottomArrow = styled.div`
	${arrowStyle} top: 0;
	left: 50%;
	margin-left: -5px;
	border-width: 0 5px 5px;
	border-bottom-color: #000;
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

const TooltipElement = styled.div`
	pointer-events: none;
	display: block;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	letter-spacing: normal;
	line-break: auto;
	line-height: 1.42857143;
	padding: 5px;
	position: absolute;
	max-width: 300px;
	text-align: left;
	text-align: start;
	text-decoration: none;
	text-shadow: none;
	text-transform: none;
	visibility: hidden;
	white-space: normal;
	word-break: normal;
	word-spacing: normal;
	word-wrap: normal;
	z-index: 10000;
	color: white;
`;

const TooltipElementInner = styled.div`
	background: black;
	border-radius: 4px;
	padding: 3px 8px;
	text-align: center;
`;

function changeInnerText(el: HTMLElement, value: string) {
	el.innerText = value;
}

interface State {
	displayTooltip: boolean;
	coordinates: {
		top: number;
		left: number;
	};
}

type Action =
	| {
			type: 'show-tooltip';
			coordinates: {
				top: number;
				left: number;
			};
	  }
	| { type: 'hide-tooltip' };

const initialState: State = {
	displayTooltip: false,
	coordinates: { top: 0, left: 0 },
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'show-tooltip':
			return { displayTooltip: true, coordinates: action.coordinates };
		case 'hide-tooltip':
			return initialState;
		default:
			return state;
	}
};

export const Tooltip = React.forwardRef((props: any, ref: any) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const tooltipRef = React.useRef<HTMLDivElement>(null);
	const tooltipInnerRef = React.useRef<HTMLDivElement>(null);
	const hideTimeout = React.useRef<number>();
	const hideOnMouseOut = React.useRef<Element | null>(null);
	const uniqueId = React.useRef(shortid.generate());

	let placement: TooltipPlacement | undefined;
	let containerStyle: React.CSSProperties | undefined;
	let innerStyle: React.CSSProperties | undefined;
	let arrowStyle: React.CSSProperties | undefined;
	let trigger = 'hover';
	let tooltipText: string;

	const { tooltipReference: TooltipReference, tooltip, ...restProps } = props;

	if (isString(tooltip)) {
		tooltipText = tooltip;
	} else {
		tooltipText = tooltip.text;
		placement = tooltip.placement;
		containerStyle = tooltip.containerStyle;
		innerStyle = tooltip.innerStyle;
		arrowStyle = tooltip.arrowStyle;

		if (tooltip.trigger) {
			trigger = tooltip.trigger;
		}
	}

	const show = (e: Event): void => {
		let top = 0;
		let left = 0;

		const target = e.target as HTMLElement;

		const boundingClientRect = target.getBoundingClientRect();

		type Mutable<T> = { -readonly [P in keyof T]-?: T[P] };

		// Position the tooltip correctly
		const boundingRect = pick(
			boundingClientRect as Mutable<typeof boundingClientRect>,
			['top', 'left', 'width', 'height'],
		);

		// Ajust bounds to compensate for scrolling
		boundingRect.top += window.scrollY;
		boundingRect.left += window.scrollX;

		// Set the contents of the tooltip using `ìnnerText` and adjust the styles
		// now, so that the height can be properly calculated
		if (tooltipInnerRef.current !== null) {
			changeInnerText(tooltipInnerRef.current, tooltipText);
		}

		if ((!placement || placement === 'top') && tooltipRef.current) {
			top = boundingRect.top - tooltipRef.current.clientHeight - TARGET_OFFSET;
			left =
				boundingRect.left +
				boundingRect.width / 2 -
				tooltipRef.current.clientWidth / 2;
		}
		if (placement === 'right' && tooltipRef.current) {
			top =
				boundingRect.top +
				boundingRect.height / 2 -
				tooltipRef.current.clientHeight / 2;
			left = boundingRect.left + boundingRect.width + TARGET_OFFSET;
		}
		if (placement === 'bottom' && tooltipRef.current) {
			top = boundingRect.top + boundingRect.height + TARGET_OFFSET;
			left =
				boundingRect.left +
				boundingRect.width / 2 -
				tooltipRef.current.clientWidth / 2;
		}
		if (placement === 'left' && tooltipRef.current) {
			top =
				boundingRect.top +
				boundingRect.height / 2 -
				tooltipRef.current.clientHeight / 2;
			left = boundingRect.left - tooltipRef.current.clientWidth - TARGET_OFFSET;
		}

		dispatch({
			type: 'show-tooltip',
			coordinates: { top, left },
		});
	};

	const hide = (): void => {
		dispatch({ type: 'hide-tooltip' });
	};

	const mouseOverEventListener = React.useCallback(
		(e: MouseEvent) => {
			const target = e.target as Element;
			if (
				!hideOnMouseOut.current ||
				// needed to work on Firefox
				hideOnMouseOut.current === target
			) {
				return;
			}

			// if the event comes from one of the child elements
			// then do not hide the tooltip
			if (
				hideOnMouseOut.current.firstElementChild &&
				hideOnMouseOut.current.contains &&
				hideOnMouseOut.current.contains(target)
			) {
				return;
			}

			hide();
			hideOnMouseOut.current = null;
		},
		[hideOnMouseOut.current],
	);

	React.useEffect(() => {
		document.addEventListener('mouseover', mouseOverEventListener);
		return () => {
			document.removeEventListener('mouseover', mouseOverEventListener);
		};
	}, [mouseOverEventListener]);

	const { displayTooltip, coordinates } = state;

	const Arrow = getArrowElement(placement);

	if (tooltipText) {
		if (trigger === 'click') {
			const oldFn = restProps.onClick || noop;

			const hideFn = () => {
				clearTimeout(hideTimeout.current);

				hideTimeout.current = window.setTimeout(() => hide(), CLICK_TIMEOUT);
			};

			restProps.onClick = (e: Event) => {
				show(e);
				hideFn();
				oldFn(e);
			};
		} else {
			const oldMEFn = restProps.onMouseEnter || noop;

			restProps.onMouseEnter = (e: Event) => {
				show(e);
				oldMEFn(e);

				if ((e.target as any).disabled) {
					hideOnMouseOut.current = e.target as Element;
				}
			};

			const oldMLFn = restProps.onMouseLeave || noop;

			restProps.onMouseLeave = (e: Event) => {
				hide();
				oldMLFn(e);
			};
		}
	}

	const ariaDescribedBy = restProps['aria-describedby'] || uniqueId.current;
	restProps['aria-describedby'] = ariaDescribedBy;

	const tooltipStyle: React.CSSProperties = merge(
		{
			top: coordinates.top,
			left: coordinates.left,
			visibility: displayTooltip ? 'visible' : 'hidden',
		},
		containerStyle,
	);

	return (
		<>
			<TooltipReference ref={ref} {...restProps} />
			<TooltipElement
				role="tooltip"
				id={ariaDescribedBy}
				hidden={!displayTooltip}
				style={tooltipStyle}
				ref={tooltipRef}
			>
				<TooltipElementInner ref={tooltipInnerRef} style={innerStyle}>
					{props.tooltipText}
				</TooltipElementInner>
				<Arrow style={arrowStyle} />
			</TooltipElement>
		</>
	);
});
