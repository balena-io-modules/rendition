import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Theme } from '../../common-types';
import { Button } from '../../components/Button';
import { Flex, FlexProps } from '../../components/Flex';
import { getColor, opaque, px } from '../../utils';

const ICON_SIZE = 14;

const Wrapper = styled(Flex)<{
	bordered?: boolean;
	solid?: boolean;
	hasDismissButton: boolean;
}>`
	position: relative;
	margin: 0;
	padding: ${(props) => px(props.theme.space[3])};
	padding-right: ${(props) =>
		px(props.hasDismissButton ? props.theme.space[4] : props.theme.space[3])};
	box-shadow: 0 0 10px 0
		${(props) => opaque(props.theme.colors.quartenary.main, 0.15)};
	border-radius: 10px;
	border: 1px solid
		${(props) =>
			props.bordered
				? props.solid
					? getColor(props, 'bg', 'main')
					: props.theme.colors.quartenary.main
				: 'transparent'};
	background-color: ${(props) =>
		props.solid ? getColor(props, 'bg', 'light') : 'white'};
	color: ${(props) =>
		props.solid ? getColor(props, 'bg', 'dark') : props.color || 'inherit'};
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
	padding: ${(props) =>
		px(props.theme.space[2])}; /* give more clickable surface area */
	top: ${(props) => px(props.theme.space[3] + props.baselineHeight / 2)};
	right: ${(props) => px(props.theme.space[3] - props.theme.space[2])};
	transform: translate(0, -50%);
`;

export interface DismissableContainerProps extends FlexProps {
	onDismiss?: () => void;
	/** Used to vertically center the dismiss button with the first line of the content, regardless of the height of the content. */
	baselineHeight?: number;
	/** If true, emphasize the container and the content */
	solid?: boolean;
	/** Custom label to be used by screen readers. When provided, an aria-label will be added to the element. */
	a11yTitle?: string;
	/** If true add borders to the container */
	bordered?: boolean;
}

interface ThemedDismissableContainerProps extends DismissableContainerProps {
	theme: Theme;
}

export const DismissableContainer = withTheme(
	React.forwardRef(
		(
			{
				children,
				onDismiss,
				baselineHeight,
				solid,
				theme,
				a11yTitle,
				bordered,
				...restProps
			}: ThemedDismissableContainerProps,
			ref,
		) => {
			// Set the default to what it would be for the base text.
			const baseline = baselineHeight || theme.fontSizes[2] * theme.lineHeight;

			return (
				<Wrapper
					solid={solid}
					bordered={bordered}
					hasDismissButton={Boolean(onDismiss)}
					ref={ref as any}
					{...restProps}
				>
					{children}
					{onDismiss && (
						<DismissButton
							title={a11yTitle || 'Dismiss'}
							a11yTitle={a11yTitle || 'Dismiss'}
							baselineHeight={baseline}
							color={
								solid
									? getColor({ theme, ...restProps }, 'bg', 'dark')
									: undefined
							}
							primary={!solid}
							plain
							onClick={onDismiss}
						>
							<FontAwesomeIcon icon={faTimes} />
						</DismissButton>
					)}
				</Wrapper>
			);
		},
	) as any,
);

DismissableContainer.defaultProps = {
	bordered: true,
};
