import find from 'lodash/find';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import {
	Coloring,
	RenditionSystemProps,
	Sizing,
	Theme,
} from '../../common-types';
import { px } from '../../utils';

const transition = 'width linear 250ms';

const Bar = styled.div<{ bg?: string; emphasized?: boolean }>`
	position: relative;
	height: ${(props) =>
		px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
	overflow: hidden;
	background: ${(props) => props.bg || props.theme.colors.primary.main};
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

const Sleeve = styled.div<{ emphasized?: boolean }>`
	position: relative;
	border-radius: ${(props) => px(props.theme.radius)};
	height: ${(props) =>
		px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
	line-height: ${(props) =>
		px(props.emphasized ? props.theme.space[4] : props.theme.space[3])};
	background: ${(props) => props.theme.colors.quartenary.main};
	font-size: ${(props) => (props.emphasized ? 1 : 0.6)}em;
	overflow: hidden;
`;

const getType = withProps((props: ThemedProgressBarProps) => {
	// get primary, tertiary, secondary and set as props.type
	const type = find(Object.keys(props), (b) =>
		find(Object.keys(props.theme.colors), (k) => k === b),
	);

	return Object.assign({}, props, { type });
});

const setTypeProps = withProps(({ type, theme, background, color }) => {
	const themeBackground = theme.colors[type || 'primary']?.main;

	return {
		color: color || '#fff',
		background: background || themeBackground,
	};
});

const Base = ({
	children,
	background,
	value,
	...props
}: InternalProgressBarProps) => {
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

export interface InternalProgressBarProps
	extends React.HTMLAttributes<HTMLElement>,
		Coloring,
		Sizing {
	/** A value between 1 and 100 that represents the progress */
	value: number;
	color?: string;
	/** A CSS color string to use for the progress bar */
	background?: string;
}

export interface ThemedProgressBarProps extends InternalProgressBarProps {
	theme: Theme;
}

export type ProgressBarProps = InternalProgressBarProps & RenditionSystemProps;

/**
 * Displays a progress bar using a value representing a percentage.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/ProgressBar/ProgressBar.stories.tsx)
 */
export const ProgressBar = asRendition<
	React.FunctionComponent<ProgressBarProps>
>(Base, [getType, setTypeProps], ['color']);
