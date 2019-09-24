import React from 'react';
import FaClose from 'react-icons/lib/fa/close';
import styled from 'styled-components';
import Button from '../../components/Button';
import { Flex, FlexProps } from '../../components/Flex';
import { getColor, px } from '../../utils';

const Wrapper = styled(Flex)<{ solid?: boolean }>`
	position: relative;
	margin: 0;
	padding: ${props =>
		`${px(props.theme.space[2])} ${px(props.theme.space[4])} ${px(
			props.theme.space[2],
		)} ${px(props.theme.space[3])}`};
	border-radius: ${props => px(props.theme.radius)};
	border: 1px solid ${props => getColor(props, 'bg', 'main')};
	background-color: ${props =>
		getColor(props, 'bg', props.solid ? 'main' : 'light')};
	color: ${props => (props.solid ? 'white' : props.color)};
`;

const DismissButton = styled(Button)<{ baselineHeight?: number }>`
	color: inherit;
	position: absolute;
	margin-top: 1px; /* This is used to normalize the icon position as it is displaced by a pixel */
	top: ${props =>
		props.baselineHeight
			? px(props.baselineHeight / 2)
			: px(props.theme.space[3])};
	right: ${props => px(props.theme.space[3])};
`;

export interface DismissableContainerProps extends FlexProps {
	onDismiss?: () => void;
	// This is passed so that we can vertically center the dismiss button with the first line of the content, regardless of the height of the content.
	baselineHeight?: number;
	solid?: boolean;
}

export const DismissableContainer = ({
	children,
	onDismiss,
	baselineHeight,
	solid,
	...restProps
}: DismissableContainerProps) => {
	return (
		<Wrapper solid={solid} {...restProps}>
			{children}
			{onDismiss && (
				<DismissButton
					baselineHeight={baselineHeight}
					plain
					onClick={onDismiss}
				>
					<FaClose />
				</DismissButton>
			)}
		</Wrapper>
	);
};
