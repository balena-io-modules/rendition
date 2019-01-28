import { Chart, ChartOptions } from 'chart.js';
import map = require('lodash/map');
import reduce = require('lodash/reduce');
import * as React from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';

import asRendition from '../asRendition';
import { doughnutDefaults, doughnutLabel } from '../chartPlugins';
import theme from '../theme';

interface ChartEntry {
	key?: number;
	value: number;
	name: string;
	color: string;
}

interface GaugeProps {
	title: string;
	placeholderColor?: string;
	data: ChartEntry[];
	disableAnimation?: boolean;
}

const { font } = theme;

const StatusGaugeWrapper = styled.div`
	display: block;
	color: ${({ theme }) => theme.colors.text.main};

	.gauge__graph {
		display: block;
		width: 100%;
		max-width: 180px;
		margin: 0px auto 10px;
	}

	.gauge__legend {
		list-style: none;
		padding: 5px;
		margin: 16px auto 0;
		background: white;
		border-radius: 5px;
		max-width: 240px;
		border: 1px solid #ececec;
		overflow: hidden;
	}

	.gauge__legend-item {
		display: flex;
		padding: 3px 0 3px 2px;
		line-height: 9px;
		width: 50%;
		float: left;
	}

	.gauge__legend-color {
		display: inline-block;
		flex: 0 0 auto;
		width: 10px;
		height: 10px;
		margin-right: 4px;
	}

	.gauge__legend-name {
		font-size: 11px;
	}
`;

class StatusGauge extends React.Component<GaugeProps, {}> {
	private doughnutChart: Chart | null;
	private doughnutRef: HTMLCanvasElement | null;

	constructor(props: GaugeProps) {
		super(props);
	}

	componentDidMount() {
		this.generateDoughnut(this.props);
	}

	componentWillReceiveProps(nextProps: GaugeProps) {
		this.generateDoughnut(nextProps);
	}

	componentWillUnmount() {
		this.destroyChart();
	}

	generateDoughnut(props: GaugeProps) {
		if (!this.doughnutRef) {
			return false;
		}
		// Redraw the chart on props update
		this.destroyChart();

		const ctx = this.doughnutRef.getContext('2d') as CanvasRenderingContext2D;
		const { title } = props;

		const data = this.getGraphData(props.data);
		const options = this.getGraphOptions(props.data, title);

		this.doughnutChart = new Chart(ctx, {
			type: 'doughnut',
			data,
			options,
			plugins: [doughnutLabel],
		});
	}

	getGraphData(data: ChartEntry[]) {
		const { values, colors, labels, count } = reduce(
			data,
			(carry, item) => {
				carry.values.push(item.value);
				carry.labels.push(item.name);
				carry.colors.push(item.color);
				carry.count += item.value;
				return carry;
			},
			{
				values: [] as number[],
				labels: [] as string[],
				colors: [] as string[],
				count: 0,
			},
		);

		return {
			labels,
			datasets: [
				{
					backgroundColor: count > 0 ? colors : this.props.placeholderColor,
					data: count > 0 ? values : [1],
				},
			],
		};
	}

	getGraphOptions(data: ChartEntry[], title: string): ChartOptions {
		const count = reduce(data, (carry, item) => carry + item.value, 0);
		const pluginOptions = this.getLabelOptions(count, title);

		const options: ChartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				display: false,
			},
			elements: {
				arc: {
					borderWidth: 0,
				},
			},
			tooltips: { enabled: count > 0 },
			plugins: { doughnutLabel: pluginOptions },
		};

		if (this.props.disableAnimation) {
			options.animation = {
				duration: 0,
			};
		}

		return options;
	}

	getLabelOptions(count: number, title: string) {
		return {
			primaryLabel: {
				...doughnutDefaults.primaryLabel,
				font,
				size: count > 999 ? 22 : count > 99 ? 30 : 38,
				offsetFromCenter: count > 999 ? 8 : 12,
				text: count,
			},
			secondaryLabel: {
				...doughnutDefaults.secondaryLabel,
				font,
				text: title.toUpperCase(),
			},
		};
	}

	destroyChart() {
		if (this.doughnutChart) {
			this.doughnutChart.destroy();
			this.doughnutChart = null;
		}
	}

	render() {
		return (
			<StatusGaugeWrapper {...this.props}>
				<div className="gauge__graph">
					<canvas
						ref={canv => (this.doughnutRef = canv)}
						width="165"
						height="165"
					/>
				</div>
				<ul className="gauge__legend">
					{map(this.props.data, item => {
						return (
							<li key={item.key || item.name} className="gauge__legend-item">
								<span
									className="gauge__legend-color"
									style={{ backgroundColor: item.color }}
								>
									&nbsp;
								</span>
								<span className="gauge__legend-name">{item.name}</span>
							</li>
						);
					})}
				</ul>
			</StatusGaugeWrapper>
		);
	}
}

export default compose(
	withTheme,
	asRendition,
)(StatusGauge) as React.ComponentClass<GaugeProps>;
