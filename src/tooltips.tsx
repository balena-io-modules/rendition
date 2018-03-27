import isString = require('lodash/isString');
import noop = require('lodash/noop');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TooltipPlacement as Placement } from 'rendition';
import styled from 'styled-components';

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

const getArrowElement = (placement?: Placement) => {
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
	display: block;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	letter-spacing: normal;
	line-break: auto;
	line-height: 1.42857143;
	padding: 5px;
	position: absolute;
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
	z-index: 1070;
`;

const TooltipElementInner = styled.div`
	background: black;
	border-radius: 4px;
	color: white;
	padding: 3px 8px;
	textalign: center;
`;

interface TooltipComponentState {
	text: string;
	placement: 'top' | 'right' | 'bottom' | 'left' | undefined;
	show: boolean;
	coordinates: {
		top: number;
		left: number;
	};
}

class TooltipComponent extends React.Component<{}, TooltipComponentState> {
	private tooltipElement: HTMLDivElement;

	constructor(props: {}) {
		super(props);

		this.state = {
			text: '',
			show: false,
			placement: 'top',
			coordinates: {
				top: 0,
				left: 0,
			},
		};
	}

	show(e: Event, tooltipText: string, placement?: Placement): void {
		let top = 0;
		let left = 0;

		// Position the tooltip correctly
		const boundingRect = (e.target as any).getBoundingClientRect();

		if (!placement || placement === 'top') {
			top = boundingRect.top - this.tooltipElement.clientHeight - TARGET_OFFSET;
			left =
				boundingRect.left +
				boundingRect.width / 2 -
				this.tooltipElement.clientWidth / 2;
		}
		if (placement === 'right') {
			top =
				boundingRect.top +
				boundingRect.height / 2 -
				this.tooltipElement.clientHeight / 2;
			left = boundingRect.left + boundingRect.width + TARGET_OFFSET;
		}
		if (placement === 'bottom') {
			top = boundingRect.top + boundingRect.height + TARGET_OFFSET;
			left =
				boundingRect.left +
				boundingRect.width / 2 -
				this.tooltipElement.clientWidth / 2;
		}
		if (placement === 'left') {
			top =
				boundingRect.top +
				boundingRect.height / 2 -
				this.tooltipElement.clientHeight / 2;
			left =
				boundingRect.left - this.tooltipElement.clientWidth - TARGET_OFFSET;
		}

		this.setState({
			text: tooltipText,
			coordinates: { top, left },
			show: true,
			placement,
		});
	}

	hide(): void {
		this.setState({ show: false });
	}

	render() {
		const Arrow = getArrowElement(this.state.placement);
		const tooltipStyle = {
			top: this.state.coordinates.top,
			left: this.state.coordinates.left,
			visibility: this.state.show ? 'visible' : 'hidden',
		};

		return (
			<TooltipElement
				style={tooltipStyle}
				innerRef={(el: any) => (this.tooltipElement = el)}
			>
				<TooltipElementInner>{this.state.text}</TooltipElementInner>
				<Arrow />
			</TooltipElement>
		);
	}
}

export class Tooltips {
	private hideTimeout: number;
	private initialised: boolean = false;
	private component: TooltipComponent;

	// Creates a tiny React app for containing the tooltips and appends it to the
	// bottom of the <body>. This allows us to overlay tooltips without affecting
	// document flow or worrying about z-index etc
	initialiseElements() {
		if (this.initialised || !document || !document.body) {
			return;
		}

		const tooltipRoot = document.createElement('div');
		tooltipRoot.id = 'rendition-tooltip-root';

		document.body.appendChild(tooltipRoot);

		this.component = ReactDOM.render(
			<TooltipComponent />,
			tooltipRoot,
		) as TooltipComponent;

		this.initialised = true;
	}

	bindProps(props: any) {
		if (props.tooltip) {
			let trigger = 'hover';
			let tooltipText: string;
			let placement: Placement;
			if (isString(props.tooltip)) {
				tooltipText = props.tooltip;
			} else {
				tooltipText = props.tooltip.text;
				placement = props.tooltip.placement;
				if (props.tooltip.trigger) {
					trigger = props.tooltip.trigger;
				}
			}
			if (tooltipText) {
				const showFn = (e: Event) => this.show(e, tooltipText, placement);

				if (trigger === 'click') {
					const oldFn = props.onClick || noop;

					const hideFn = () => {
						clearTimeout(this.hideTimeout);

						this.hideTimeout = window.setTimeout(
							() => this.hide(),
							CLICK_TIMEOUT,
						);
					};

					props.onClick = (e: Event) => {
						showFn(e);
						hideFn();
						oldFn(e);
					};
				} else {
					const oldMEFn = props.onMouseEnter || noop;

					props.onMouseEnter = (e: Event) => {
						showFn(e);
						oldMEFn(e);
					};

					const oldMLFn = props.onMouseLeave || noop;

					props.onMouseLeave = (e: Event) => {
						this.hide();
						oldMLFn(e);
					};
					props.onMouseLeave = () => this.hide();
				}
			}
		}

		return props;
	}

	show(e: Event, tooltipText: string, placement?: Placement): void {
		this.initialiseElements();

		this.component.show(e, tooltipText, placement);
	}

	hide(): void {
		this.initialiseElements();

		this.component.hide();
	}
}
