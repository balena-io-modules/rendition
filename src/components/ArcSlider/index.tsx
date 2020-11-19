import * as React from 'react';
import styled from 'styled-components';
import { darken } from '../../utils';
import { Box, BoxProps } from '../Box';
import { Flex } from '../Flex';

const ANGLERANGE = 135;

interface Point {
	x: number;
	y: number;
}

const getAngleBetweenPoints = (p1: Point, p2: Point) => {
	return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
};

const constrainNumber = (
	value: number,
	lower: number = 0,
	upper: number = 100,
) => {
	return Math.min(Math.max(value, lower), upper);
};

const StyledSVG = styled.svg`
	display: block;
	width: 100%;
	height: 100%;
`;

const ArcSliderContainer = styled(Box)`
	position: relative;
`;

const LabelContainer = styled(Flex).attrs({
	justifyContent: 'center',
	flexDirection: 'column',
})`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	text-align: center;
	pointer-events: none;
`;

const polarToCartesian = (
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) => {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
};

const describeArc = (
	x: number,
	y: number,
	radius: number,
	startAngle: number,
	endAngle: number,
) => {
	const start = polarToCartesian(x, y, radius, endAngle);
	const end = polarToCartesian(x, y, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

	const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

	return d;
};

interface ArcSliderState {
	isDragging: boolean;
	innerValue: number;
}

class BaseArcSlider extends React.Component<ArcSliderProps, ArcSliderState> {
	private $slider: SVGSVGElement | null = null;

	constructor(props: any) {
		super(props);

		const { value } = props;

		this.state = {
			isDragging: false,
			innerValue: value == null ? 0 : constrainNumber(value, 0, 1),
		};
	}

	public componentDidMount() {
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('touchmove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);
		document.addEventListener('touchend', this.handleMouseUp);
		document.addEventListener('touchcancel', this.handleMouseUp);
	}

	public componentWillUnmount() {
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('touchmove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchend', this.handleMouseUp);
		document.removeEventListener('touchcancel', this.handleMouseUp);
	}

	public handleMouseUp = () => {
		this.setState({ isDragging: false });
	};

	public handleMouseDown = (e: any) => {
		e.preventDefault();
		this.setState({ isDragging: true });
	};

	public handleMouseMove = (e: any) => {
		if (this.state.isDragging && this.$slider) {
			const { left, top, width, height } = this.$slider.getBoundingClientRect();

			const sliderCenter = {
				x: left + width / 2,
				y: top + height / 2,
			};

			let mouseLocation = {
				x: e.pageX,
				y: e.pageY,
			};

			// If this is a touch event, the page coordinates need to be retrieved
			// from the `touches` collection
			if (!!e.touches) {
				mouseLocation = {
					x: e.touches[0].pageX,
					y: e.touches[0].pageY,
				};
			}

			// Normalize the angle to make 0 degrees the topmost point of the arc
			let angleDegrees =
				getAngleBetweenPoints(sliderCenter, mouseLocation) + 90;

			if (angleDegrees > 180) {
				angleDegrees = Math.max(angleDegrees - 360, -ANGLERANGE);
			} else if (angleDegrees < -ANGLERANGE) {
				angleDegrees = -ANGLERANGE;
			} else if (angleDegrees > ANGLERANGE) {
				angleDegrees = ANGLERANGE;
			}

			const value = (angleDegrees + ANGLERANGE) / (ANGLERANGE * 2);

			this.setState({
				innerValue: value,
			});

			if (this.props.onValueChange) {
				this.props.onValueChange(value);
			}
		}
	};

	public render() {
		const { innerValue } = this.state;

		// If there is no value prop, use the innerValue so that the slider can
		// behave like an uncontrolled input
		const value =
			this.props.value == null
				? innerValue
				: constrainNumber(this.props.value, 0, 1);
		const { onValueChange, children, ...props } = this.props;
		const color = this.props.fillColor || '#FEC400';
		const background = this.props.background || '#707274';
		const valueAngle = ANGLERANGE * 2 * value - ANGLERANGE;

		return (
			<ArcSliderContainer {...props}>
				<StyledSVG
					style={{
						cursor: this.state.isDragging ? 'grabbing' : 'grab',
					}}
					ref={(elem) => (this.$slider = elem)}
					viewBox="0 0 600 600"
					onMouseDown={this.handleMouseDown}
					onTouchStart={this.handleMouseDown}
				>
					<defs>
						<linearGradient
							id="rendition-arc-slider-gradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor={darken(color)} />
							<stop offset="100%" stopColor={color} />
						</linearGradient>

						<filter
							xmlns="http://www.w3.org/2000/svg"
							id="rendition-arc-slider-dropshadow"
							height="130%"
						>
							<feGaussianBlur in="SourceAlpha" stdDeviation="1.25" />
							<feOffset dx="0" dy="0" result="offsetblur" />
							<feMerge>
								<feMergeNode />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>

					<path
						fill="none"
						stroke={background}
						strokeWidth="20.5"
						strokeLinecap="round"
						d={describeArc(300, 300, 200, -ANGLERANGE, ANGLERANGE)}
					/>

					<path
						fill="none"
						stroke="url(#rendition-arc-slider-gradient)"
						strokeWidth="22"
						strokeLinecap="round"
						d={describeArc(300, 300, 200, -ANGLERANGE, valueAngle)}
					/>

					<circle
						cx="300"
						cy="100"
						r="20"
						fill="white"
						filter="url(#rendition-arc-slider-dropshadow)"
						transform={`rotate(${valueAngle}, 300, 300)`}
					/>

					<circle
						cx="300"
						cy="100"
						r="14"
						fill={color}
						transform={`rotate(${valueAngle}, 300, 300)`}
					/>
				</StyledSVG>

				<LabelContainer>{children}</LabelContainer>
			</ArcSliderContainer>
		);
	}
}

export interface ArcSliderProps extends BoxProps {
	/** A function that is called when the slider value changes, this will always be a value between 0 and 1 */
	onValueChange?: (value: number) => void;
	/** A number between 0 and 1 that represents the progress */
	value?: number;
	/** A CSS color string to use for the color of the "filled" part of the arc */
	fillColor?: string;
	/** A CSS color string to use for the color of the arc track */
	background?: string;
}

/**
 * A slider input that is displayed as an arc. This component will scale in size to fit it's container.
 * A label can be added by placing a child element inside this component.
 *
 *  [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/ArcSlider/ArcSlider.stories.tsx)
 */
export const ArcSlider = BaseArcSlider;
