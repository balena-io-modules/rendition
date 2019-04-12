import assign = require('lodash/assign');
import find = require('lodash/find');
import get = require('lodash/get');
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../asRendition';
import { Coloring, DefaultProps, Sizing, Theme } from '../common-types';
import { radius } from '../theme';
import { px } from '../utils';

export interface ProgressBarProps extends DefaultProps, Coloring, Sizing {
	value: number;
	color?: string;
	background?: string;
}

export interface ThemedProgressBarProps extends ProgressBarProps {
	theme: Theme;
}

const transition = 'width linear 250ms';

// TODO: Use "Exclude" type after upgrading to TypeScript 2.8+
declare var { value, ...rest }: ProgressBarProps;
type ProgressBarRestProps = typeof rest;

const Bar = styled.div<ProgressBarRestProps & { bg?: string }>`
	position: relative;
	height: ${props =>
		px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
	overflow: hidden;
	background: ${props => props.bg || props.theme.colors.primary.main};
	transition: ${transition};
	text-align: center;
`;

const LoadingContent = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	text-align: center;
	color: #000;
	text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
`;

const Content = styled.div`
	text-align: center;
	position: absolute;
	left: 0;
	bottom: 0;
	top: 0;
	text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
	transition: ${transition};
`;

const Sleeve = styled.div<ProgressBarRestProps>`
	position: relative;
	border-radius: ${px(radius)};
	height: ${props =>
		px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
	line-height: ${props =>
		px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
	background: ${props => props.theme.colors.quartenary.main};
	font-size: ${props => (props.emphasized ? 1 : 0.6)}em;
	overflow: hidden;
`;

const getType = withProps((props: ThemedProgressBarProps) => {
	// get primary, tertiary, secondary and set as props.type
	const type = find(Object.keys(props), b =>
		find(Object.keys(props.theme.colors), k => k === b),
	);

	return assign({}, props, { type });
});

const setTypeProps = withProps(({ type, theme, background, color }) => {
	const themeBackground = get(theme.colors[type || 'primary'], 'main');

	return {
		color: color || '#fff',
		background: background || themeBackground,
	};
});

const Base = ({ children, background, value, ...props }: ProgressBarProps) => {
	return (
		<Sleeve {...props}>
			<LoadingContent>{children}</LoadingContent>
			<Bar bg={background} style={{ width: `${value}%` }}>
				<Content style={{ width: `${value && (100 * 100) / value}%` }}>
					{children}
				</Content>
			</Bar>
		</Sleeve>
	);
};

export default asRendition<ProgressBarProps>(
	Base,
	[getType, setTypeProps],
	['color'],
);
