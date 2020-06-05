import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import findIndex from 'lodash/findIndex';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../../common-types';
import Arrow from '../../internal/Arrow';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { Flex } from '../Flex';
import Heading from '../Heading';
import Link from '../Link';
import Txt from '../Txt';
import { Box } from '../Box';
import { px } from '../../utils';

export interface InternalStepsProps extends DefaultProps {
	bordered?: boolean;
	ordered?: boolean;
	activeStepIndex?: number;
	titleText?: string;
	titleIcon?: React.ReactNode;
	onClose?: () => void;
}

interface ThemedInternalStepsProps extends InternalStepsProps {
	theme: Theme;
}

type statusOptions = 'none' | 'pending' | 'completed';

export interface StepProps {
	children: string;
	status: statusOptions;
	onClick?: () => void;
}

interface InternalStepProps extends StepProps {
	index: number;
	active?: boolean;
	ordered?: boolean;
}

interface StepIconProps {
	ordered: boolean;
	index: number;
	active: boolean;
	status: statusOptions;
}

const StepIconWrapper = styled(Flex)`
	align-items: center;
	justify-content: center;
	font-size: ${(props) => px(props.theme.fontSizes[5])};
`;

const StepIconLabel = styled(Txt)`
	font-size: ${(props) => px(props.theme.fontSizes[3])};
	height: ${(props) => px(props.theme.fontSizes[5])};
	width: ${(props) => px(props.theme.fontSizes[5])};
	display: flex;
	align-items: center;
	justify-content: center;
	font-variant-numeric: tabular-nums;
`;

const OutlineCircle = styled(Box)`
	font-size: ${(props) => px(props.theme.fontSizes[3])};
	height: ${(props) => px(props.theme.fontSizes[5])};
	width: ${(props) => px(props.theme.fontSizes[5])};
	border: 1px solid;
	border-radius: 50%;
`;

const StepIcon = ({ ordered, status, active, index }: StepIconProps) => {
	if (status === 'none') {
		return null;
	}

	if (status === 'completed' && !active) {
		return (
			<StepIconWrapper mr={2} color="success.main">
				<FontAwesomeIcon icon={faCheckCircle} />
			</StepIconWrapper>
		);
	}

	if (ordered && active) {
		return (
			<StepIconWrapper mr={2} className={'fa-layers'} color="primary.main">
				<FontAwesomeIcon icon={faCircle} />
				<StepIconLabel className="fa-layers-text fa-inverse">
					{index + 1}
				</StepIconLabel>
			</StepIconWrapper>
		);
	}

	if (ordered && !active) {
		return (
			<StepIconWrapper
				mr={2}
				className={'fa-layers'}
				color="tertiary.semilight"
			>
				<OutlineCircle />
				<StepIconLabel className="fa-layers-text">{index + 1}</StepIconLabel>
			</StepIconWrapper>
		);
	}

	return (
		<StepIconWrapper mr={2} color="tertiary.semilight">
			<FontAwesomeIcon icon={faCheckCircle} />
		</StepIconWrapper>
	);
};

const StepBase = ({
	ordered,
	active,
	index,
	status,
	children,
	onClick,
}: InternalStepProps) => {
	if (typeof children !== 'string') {
		throw new Error('The child of a Step has to be a string.');
	}

	return (
		<Flex
			flexDirection="row"
			justifyContent="center"
			alignItems="center"
			fontSize={2}
		>
			<StepIcon
				ordered={Boolean(ordered)}
				status={status}
				active={Boolean(active)}
				index={index}
			/>
			{onClick ? (
				<Link onClick={onClick}>{children}</Link>
			) : (
				<Txt bold={active} color={active ? undefined : 'tertiary.light'}>
					{children}
				</Txt>
			)}
		</Flex>
	);
};

export const Step = StepBase as React.FunctionComponent<StepProps>;

const FramelessSteps = ({
	ordered,
	activeStepIndex,
	children,
	...otherProps
}: any) => {
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

				const firstPendingStepIndex = findIndex(children, {
					props: { status: 'pending' },
				});
				const enableNextStep =
					!ordered ||
					firstPendingStepIndex === -1 ||
					firstPendingStepIndex > index;
				const allPrevStepsComplete =
					firstPendingStepIndex === -1 || firstPendingStepIndex >= index;

				// A step should be clickable if:
				// - steps are not orderable OR
				// - it's located before the active step OR
				// - it's not the current step AND all previous steps are complete
				const onClick =
					!ordered ||
					index < activeStepIndex ||
					(index !== activeStepIndex && allPrevStepsComplete)
						? step.props.onClick
						: undefined;

				return (
					<Flex flexDirection="row" alignItems="center">
						{React.cloneElement(step, {
							ordered,
							index,
							onClick,
							active: activeStepIndex === index,
						})}
						{index < children.length - 1 && (
							<Flex justifyContent="center" alignItems="center" mx={3}>
								<Arrow disabled={!enableNextStep} />
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
		{
			theme,
			className,
			children,
			ordered,
			bordered,
			activeStepIndex,
			titleText,
			titleIcon,
			onClose,
		}: ThemedInternalStepsProps,
		ref,
	) => {
		if (ordered) {
			if (typeof activeStepIndex !== 'number') {
				throw new Error(
					'You must specify the activeStepIndex for ordered Steps',
				);
			} else {
				const stepCount = React.Children.count(children);
				if (activeStepIndex < 0 || activeStepIndex >= stepCount) {
					throw new Error('activeStepIndex is out of range');
				}
			}
		}
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
				bordered={bordered}
				ref={ref as any}
			>
				{(titleText || titleIcon) && (
					<Flex
						minHeight={theme.fontSizes[5]}
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
					</Flex>
				)}
				<FramelessSteps
					ordered={Boolean(ordered)}
					activeStepIndex={activeStepIndex}
				>
					{children}
				</FramelessSteps>
			</DismissableContainer>
		);
	},
);

Steps.defaultProps = {
	bordered: true,
	ordered: false,
};

export type StepsProps = InternalStepsProps & RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		StepsProps & React.RefAttributes<HTMLDivElement>
	>
>(Steps);
