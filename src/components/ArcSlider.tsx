import * as React from 'react';
import { ArcSliderProps } from 'rendition';
import styled from 'styled-components';
import { constrainNumber, darken, getAngleBetweenPoints } from '../utils';
import { Box, Flex } from './Grid';

const ANGLERANGE = 135;

const StyledSVG = styled.svg`
	display: block;
	width: 100%;
	height: 100%;
`;

const ArcSliderContainer = styled(Box)`
	position: relative;
`;

const LabelContainer = styled(Flex).attrs({
	justify: 'center',
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
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

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

	const d = `M ${start.x} ${
		start.y
	} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

	return d;
};

interface ArcSliderState {
	isDragging: boolean;
	innerValue: number;
}

class ArcSlider extends React.Component<ArcSliderProps, ArcSliderState> {
	private $slider: SVGSVGElement | null = null;

	constructor(props: any) {
		super(props);

		const { value } = props;

		this.state = {
			isDragging: false,
			innerValue: value == null ? 0 : constrainNumber(value, 0, 1),
		};
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('touchmove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);
		document.addEventListener('touchend', this.handleMouseUp);
		document.addEventListener('touchcancel', this.handleMouseUp);
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('touchmove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('touchend', this.handleMouseUp);
		document.removeEventListener('touchcancel', this.handleMouseUp);
	}

	handleMouseUp = () => {
		this.setState({ isDragging: false });
	};

	handleMouseDown = (e: any) => {
		e.preventDefault();
		this.setState({ isDragging: true });
	};

	handleMouseMove = (e: any) => {
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

	render() {
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
					innerRef={(elem: any) => (this.$slider = elem)}
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

export default ArcSlider;
