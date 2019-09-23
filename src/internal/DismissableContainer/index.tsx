import React from 'react';
import FaClose from 'react-icons/lib/fa/close';
import styled, { withTheme } from 'styled-components';
import { Theme } from '../../common-types';
import Button from '../../components/Button';
import { Flex, FlexProps } from '../../components/Flex';
import { getColor, opaque, px } from '../../utils';

const ICON_SIZE = 14;

const Wrapper = styled(Flex)<{ solid?: boolean; hasDismissButton: boolean }>`
	position: relative;
	margin: 0;
	padding: ${props => px(props.theme.space[3])};
	padding-right: ${props =>
		px(props.hasDismissButton ? props.theme.space[4] : props.theme.space[3])};
	box-shadow: 0 0 10px 0
		${props => opaque(props.theme.colors.quartenary.main, 0.15)};
	border-radius: 10px;
	border: 1px solid
		${props =>
			props.solid
				? getColor(props, 'bg', 'main')
				: props.theme.colors.quartenary.main};
	background-color: ${props =>
		props.solid ? getColor(props, 'bg', 'main') : 'white'};
	color: ${props => (props.solid ? 'white' : props.color || 'inherit')};
`;

const DismissButton = styled(Button)<{
	solid?: boolean;
	baselineHeight: number;
}>`
	position: absolute;
	& svg {
		height: ${px(ICON_SIZE)};
		width: ${px(ICON_SIZE)};
	}
	font-size: ${px(ICON_SIZE)};
	padding: ${props =>
		px(props.theme.space[2])}; /* give more clickable surface area */
	top: ${props =>
		px(
			props.theme.space[3] -
				props.theme.space[2] +
				(props.baselineHeight - ICON_SIZE) / 2,
		)};
	right: ${props => px(props.theme.space[3] - props.theme.space[2])};
`;

export interface DismissableContainerProps extends FlexProps {
	onDismiss?: () => void;
	// This is passed so that we can vertically center the dismiss button with the first line of the content, regardless of the height of the content.
	baselineHeight?: number;
	solid?: boolean;
}

interface ThemedDismissableContainerProps extends DismissableContainerProps {
	theme: Theme;
}

export const DismissableContainer = withTheme(React.forwardRef(
	(
		{
			children,
			onDismiss,
			baselineHeight,
			solid,
			theme,
			...restProps
		}: ThemedDismissableContainerProps,
		ref,
	) => {
		// Set the default to what it would be for the base text.
		const baseline = baselineHeight || theme.fontSizes[1] * theme.lineHeight;

		return (
			<Wrapper
				solid={solid}
				hasDismissButton={Boolean(onDismiss)}
				ref={ref as any}
				{...restProps}
			>
				{children}
				{onDismiss && (
					<DismissButton
						baselineHeight={baseline}
						color={solid ? 'white' : undefined}
						primary={!solid}
						plain
						onClick={onDismiss}
					>
						<FaClose />
					</DismissButton>
				)}
			</Wrapper>
		);
	},
) as any);
