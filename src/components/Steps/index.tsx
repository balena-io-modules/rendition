import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../../common-types';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { px } from '../../utils';
import { Flex } from '../Flex';
import Heading from '../Heading';
import Link from '../Link';
import Txt from '../Txt';
import { Arrow } from './Arrow';

export interface InternalStepsProps extends DefaultProps {
	titleText?: string;
	titleIcon?: React.ReactNode;
	onClose?: () => void;
}

export interface StepProps {
	children: string;
	status: 'none' | 'pending' | 'completed';
	onClick?: () => void;
}

const getStatusColor = (theme: Theme, status: StepProps['status']) => {
	switch (status) {
		case 'pending':
			return theme.colors.tertiary.semilight;
		case 'completed':
			return theme.colors.success.main;
	}
};

const StatusIconPlaceholder = styled.span<{ status: StepProps['status'] }>`
	font-size: ${props => px(props.theme.fontSizes[4])};
	line-height: ${props => px(props.theme.fontSizes[4])};
	color: ${props => getStatusColor(props.theme, props.status)};
`;

const HeaderContainer = styled(Flex)`
	min-height: ${props => px(props.theme.fontSizes[5])};
`;

export const Step = ({ status, children, onClick }: StepProps) => {
	if (typeof children !== 'string') {
		throw new Error('The child of a Step has to be a string.');
	}

	return (
		<Flex flexDirection="row" justifyContent="center" alignItems="center">
			{status !== 'none' && (
				<StatusIconPlaceholder status={status}>
					<FontAwesomeIcon icon={faCheckCircle} />
				</StatusIconPlaceholder>
			)}
			{onClick ? (
				<Link ml={status === 'none' ? 0 : 2} onClick={onClick}>
					{children}
				</Link>
			) : (
				<Txt ml={2}>{children}</Txt>
			)}
		</Flex>
	);
};

const FramelessSteps = ({ children, ...otherProps }: any) => {
	return (
		<Flex
			mx="auto"
			flexDirection="row"
			alignItems="center"
			flexWrap="wrap"
			{...otherProps}
		>
			{React.Children.map(children, (step, index) => {
				if (step.type !== Step) {
					throw new Error(
						'You can only use Step components as children of Steps.',
					);
				}

				return (
					<Flex flexDirection="row" alignItems="center">
						{step}
						{index < children.length - 1 && (
							<Flex justifyContent="center" alignItems="center" mx={3}>
								<Arrow />
							</Flex>
						)}
					</Flex>
				);
			})}
		</Flex>
	);
};

const Steps = React.forwardRef(
	(
		{ className, children, titleText, titleIcon, onClose }: InternalStepsProps,
		ref,
	) => {
		return (
			<DismissableContainer
				p={3}
				className={className}
				flexDirection="row"
				justifyContent="space-between"
				flexWrap="wrap"
				alignItems="center"
				onDismiss={onClose}
				baselineHeight={34}
				ref={ref as any}
			>
				{(titleText || titleIcon) && (
					<HeaderContainer
						justifyContent="center"
						alignItems="center"
						ml={2}
						mr={4}
					>
						{titleIcon && (
							<Txt fontSize={2} mr={2} color="tertiary.semilight">
								{titleIcon}
							</Txt>
						)}
						{titleText && (
							<Heading.h6 color="tertiary.main">{titleText}</Heading.h6>
						)}
					</HeaderContainer>
				)}
				<FramelessSteps>{children}</FramelessSteps>
			</DismissableContainer>
		);
	},
);

export type StepsProps = InternalStepsProps & RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		StepsProps & React.RefAttributes<HTMLDivElement>
	>
>(Steps);
