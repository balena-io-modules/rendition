import merge from 'lodash/merge';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { TooltipPlacement } from './common-types';

// The distance between the tooltip arrow and the target element
const TARGET_OFFSET = 3;

// The time in ms to show a tooltip after being triggered by a click event
const CLICK_TIMEOUT = 1000;

const createOnRemoveObserver = (
	element: Node,
	onDetachCallback: () => void,
) => {
	const observer = new MutationObserver(() => {
		if (!document.contains(element)) {
			observer.disconnect();
			onDetachCallback();
		}
	});

	observer.observe(document, {
		childList: true,
		subtree: true,
	});

	return observer;
};

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

interface TooltipShowOptions {
	placement?: TooltipPlacement;
	containerStyle?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	arrowStyle?: React.CSSProperties;
}

interface TooltipComponentState {
	placement?: TooltipPlacement;
	show: boolean;
	coordinates: {
		top: number;
		left: number;
	};
	containerStyle?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	arrowStyle?: React.CSSProperties;
}

class TooltipComponent extends React.Component<{}, TooltipComponentState> {
	private tooltipElement: HTMLDivElement;
	private tooltipElementInner: HTMLDivElement | null;
	private observer: MutationObserver | undefined;

	constructor(props: {}) {
		super(props);

		this.state = {
			show: false,
			placement: 'top',
			coordinates: {
				top: 0,
				left: 0,
			},
		};
	}

	// Create an observer that will hide the tooltip if the target element is
	// removed from the DOM
	public observe(target: HTMLElement) {
		// If an observer exists, disconnect it
		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = createOnRemoveObserver(target, () => {
			this.hide();
		});
	}

	public show(
		e: Event,
		tooltipText: string,
		options: TooltipShowOptions = {},
	): void {
		let top = 0;
		let left = 0;

		const target = e.target as HTMLElement;

		this.observe(target);

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

		const { placement, containerStyle, innerStyle, arrowStyle } = options;

		// Set the contents of the tooltip using `ìnnerText` and adjust the styles
		// now, so that the height can be properly calculated
		if (this.tooltipElementInner) {
			this.tooltipElementInner.innerText = tooltipText;
		}

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
			coordinates: { top, left },
			show: true,
			placement,
			containerStyle,
			innerStyle,
			arrowStyle,
		});
	}

	public hide(): void {
		// If an observer exists, disconnect it
		if (this.observer) {
			this.observer.disconnect();
			this.observer = undefined;
		}

		this.setState({
			show: false,
			coordinates: {
				top: 0,
				left: 0,
			},
		});
	}

	public render() {
		const { placement, containerStyle, innerStyle, arrowStyle } = this.state;
		const Arrow = getArrowElement(placement);
		const tooltipStyle: React.CSSProperties = merge(
			{
				top: this.state.coordinates.top,
				left: this.state.coordinates.left,
				visibility: this.state.show ? 'visible' : 'hidden',
			},
			containerStyle,
		);

		return (
			<TooltipElement
				style={tooltipStyle}
				ref={(el: any) => (this.tooltipElement = el)}
			>
				<TooltipElementInner
					ref={(el) => (this.tooltipElementInner = el)}
					style={innerStyle}
				/>

				<Arrow style={arrowStyle} />
			</TooltipElement>
		);
	}
}

export class Tooltips {
	private hideTimeout: number;
	private initialised: boolean = false;
	private component: TooltipComponent;
	private hideOnMouseOut: Element | null = null;

	// Creates a tiny React app for containing the tooltips and appends it to the
	// bottom of the <body>. This allows us to overlay tooltips without affecting
	// document flow or worrying about z-index etc
	public initialiseElements() {
		if (this.initialised || !document || !document.body) {
			return;
		}

		const tooltipRoot = document.createElement('div');
		tooltipRoot.id = 'rendition-tooltip-root';

		document.body.appendChild(tooltipRoot);

		// This is a special case for handling disabled elements. When a tooltip is
		// shown on a tooltip element, the flag is activated and the next time this
		// event listener is called the tooltip is hidden. This happens because
		// a mouseover event will be triggered when the cursor leaves a disabled
		// element.
		// See: https://github.com/facebook/react/issues/4251#issuecomment-334266778
		document.addEventListener('mouseover', (e) => {
			const target = e.target as Element;
			if (
				!this.hideOnMouseOut ||
				// needed to work on Firefox
				this.hideOnMouseOut === target
			) {
				return;
			}

			// if the event comes from one of the child elements
			// then do not hide the tooltip
			if (
				this.hideOnMouseOut.firstElementChild &&
				this.hideOnMouseOut.contains &&
				this.hideOnMouseOut.contains(target)
			) {
				return;
			}

			this.hide();
			this.hideOnMouseOut = null;
		});

		// TODO: In future versions, the render function will return void, reference here: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/index.d.ts
		this.component = (ReactDOM.render(
			<TooltipComponent />,
			tooltipRoot,
		) as unknown) as TooltipComponent;

		this.initialised = true;
	}

	public bindProps(props: any) {
		if (props.tooltip) {
			const options: TooltipShowOptions = {};
			let trigger = 'hover';
			let tooltipText: string;
			if (typeof props.tooltip === 'string') {
				tooltipText = props.tooltip;
			} else {
				tooltipText = props.tooltip.text;
				options.placement = props.tooltip.placement;
				options.containerStyle = props.tooltip.containerStyle;
				options.innerStyle = props.tooltip.innerStyle;
				options.arrowStyle = props.tooltip.arrowStyle;

				if (props.tooltip.trigger) {
					trigger = props.tooltip.trigger;
				}
			}
			if (tooltipText) {
				const showFn = (e: Event) => this.show(e, tooltipText, options);

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

						if ((e.target as any).disabled) {
							this.hideOnMouseOut = e.target as Element;
						}
					};

					const oldMLFn = props.onMouseLeave || noop;

					props.onMouseLeave = (e: Event) => {
						this.hide();
						oldMLFn(e);
					};
				}
			}
		}

		return props;
	}

	public show(
		e: Event,
		tooltipText: string,
		options?: TooltipShowOptions,
	): void {
		this.initialiseElements();

		this.component.show(e, tooltipText, options);
	}

	public hide(): void {
		this.initialiseElements();

		this.component.hide();
	}
}
