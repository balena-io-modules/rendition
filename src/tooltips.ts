import isString = require('lodash/isString');
import noop = require('lodash/noop');
import { TooltipPlacement as Placement } from 'rendition';
import { px } from './utils';

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

const topArrowStyle = `
	${arrowStyle}
	bottom: 0;
	left: 50%;
	margin-left: -5px;
	border-width: 5px 5px 0;
	border-top-color: #000;
`;

const rightArrowStyle = `
	${arrowStyle}
	top: 50%;
	left: 0;
	margin-top: -5px;
	border-width: 5px 5px 5px 0;
	border-right-color: #000;
`;

const leftArrowStyle = `
	${arrowStyle}
	top: 50%;
	right: 0;
	margin-top: -5px;
	border-width: 5px 0 5px 5px;
	border-left-color: #000;
`;

const bottomArrowStyle = `
	${arrowStyle}
	top: 0;
  left: 50%;
  margin-left: -5px;
  border-width: 0 5px 5px;
  border-bottom-color: #000;
`;

const getArrowStyle = (placement?: Placement) => {
	switch (placement) {
		case 'right':
			return rightArrowStyle;
		case 'bottom':
			return bottomArrowStyle;
		case 'left':
			return leftArrowStyle;
		default:
			return topArrowStyle;
	}
};

export class Tooltips {
	private tooltipElement: HTMLDivElement;
	private tooltipElementInner: HTMLDivElement;
	private tooltipElementArrow: HTMLDivElement;
	private hideTimeout: number;

	constructor() {
		const tooltipElement = document.createElement('div');
		tooltipElement.setAttribute(
			'style',
			`
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
		`,
		);

		const tooltipElementInner = document.createElement('div');
		tooltipElementInner.setAttribute(
			'style',
			`
			background: black;
			border-radius: 4px;
			color: white;
			padding: 3px 8px;
			textAlign: center;
		`,
		);

		const tooltipArrow = document.createElement('div');
		tooltipArrow.setAttribute(
			'style',
			`
			${arrowStyle}
			bottom: 0;
			left: 50%;
			margin-left: -5px;
			border-width: 5px 5px 0;
			border-top-color: #000;
		`,
		);

		tooltipElement.appendChild(tooltipElementInner);
		tooltipElement.appendChild(tooltipArrow);

		document.body.appendChild(tooltipElement);

		this.tooltipElement = tooltipElement;
		this.tooltipElementInner = tooltipElementInner;
		this.tooltipElementArrow = tooltipArrow;
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
					props.onClick = (e: Event) => showFn(e) || hideFn() || oldFn(e);
				} else {
					const oldMEFn = props.onMouseEnter || noop;
					props.onMouseEnter = (e: Event) => showFn(e) || oldMEFn(e);

					const oldMLFn = props.onMouseLeave || noop;
					props.onMouseLeave = (e: Event) => this.hide() || oldMLFn(e);
					props.onMouseLeave = () => this.hide();
				}
			}
		}

		return props;
	}

	show(e: Event, tooltipText: string, placement?: Placement): void {
		// Set the tooltip text
		this.tooltipElementInner.innerText = tooltipText;

		// Set the arrow in the correct location
		this.tooltipElementArrow.setAttribute('style', getArrowStyle(placement));

		// Position the tooltip correctly
		const boundingRect = (e.target as any).getBoundingClientRect();

		if (!placement || placement === 'top') {
			this.tooltipElement.style.top = px(
				boundingRect.top - this.tooltipElement.clientHeight - TARGET_OFFSET,
			);
			this.tooltipElement.style.left = px(
				boundingRect.left +
					boundingRect.width / 2 -
					this.tooltipElement.clientWidth / 2,
			);
		}
		if (placement === 'right') {
			this.tooltipElement.style.top = px(
				boundingRect.top +
					boundingRect.height / 2 -
					this.tooltipElement.clientHeight / 2,
			);
			this.tooltipElement.style.left = px(
				boundingRect.left + boundingRect.width + TARGET_OFFSET,
			);
		}
		if (placement === 'bottom') {
			this.tooltipElement.style.top = px(
				boundingRect.top + boundingRect.height + TARGET_OFFSET,
			);
			this.tooltipElement.style.left = px(
				boundingRect.left +
					boundingRect.width / 2 -
					this.tooltipElement.clientWidth / 2,
			);
		}
		if (placement === 'left') {
			this.tooltipElement.style.top = px(
				boundingRect.top +
					boundingRect.height / 2 -
					this.tooltipElement.clientHeight / 2,
			);
			this.tooltipElement.style.left = px(
				boundingRect.left - this.tooltipElement.clientWidth - TARGET_OFFSET,
			);
		}
		this.tooltipElement.style.visibility = 'visible';
	}

	hide(): void {
		this.tooltipElement.style.visibility = 'hidden';
	}
}
