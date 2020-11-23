import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import findIndex from 'lodash/findIndex';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps, Theme } from '../../common-types';
import Arrow from '../../internal/Arrow';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { Flex } from '../Flex';
import { Heading } from '../Heading';
import { Link } from '../Link';
import { Txt } from '../Txt';
import { Box } from '../Box';
import { px } from '../../utils';

export interface InternalStepsProps extends React.HTMLAttributes<HTMLElement> {
	/** If true (default), the steps container will have a visible border */
	bordered?: boolean;
	/** If true, the steps will be treated as an ordered list. Instead of the check icon, pending ordered steps will be displayed with a grey step number and active ordered steps with a blue step number. */
	ordered?: boolean;
	/** If passed, specifies the step that is currently active. Only use with the `ordered` prop */
	activeStepIndex?: number;
	/** If passed, the steps will have a title at the beginning */
	titleText?: string;
	/** If passed, an icon will be shown next to the title text, or on its own if there is no title text passed */
	titleIcon?: React.ReactNode;
	/** Function that is called when a user clicks on the close button, if not passed, no close button will be rendered */
	onClose?: () => void;
}

interface ThemedInternalStepsProps extends InternalStepsProps {
	theme: Theme;
}

type statusOptions = 'none' | 'pending' | 'completed';

export interface StepProps {
	/** The text of the step */
	children: string;
	/** Indicate the status of the step */
	status: statusOptions;
	/** If passed, the step will be clickable. Note: If the steps are ordered, this callback should be used to update the activeStepIndex prop passed to the Steps component. */
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

const BaseStep = ({
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

export const Step = BaseStep as React.FunctionComponent<StepProps>;

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
					<Flex key={index} flexDirection="row" alignItems="center">
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

const BaseSteps = React.forwardRef(
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
				className={className}
				flexDirection="row"
				justifyContent="space-between"
				flexWrap="wrap"
				alignItems="center"
				onDismiss={onClose}
				baselineHeight={theme.fontSizes[3] * theme.lineHeight}
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

BaseSteps.defaultProps = {
	bordered: true,
	ordered: false,
};

export type StepsProps = InternalStepsProps & RenditionSystemProps;

/**
 * A visual guide showing a number of steps to be performed by the user. The `Steps` component takes one or more `Step` components as children.
 *
 * If the `ordered` prop is `true`, the steps will be considered as an ordered (numbered) list. In this case, the `activeStepIndex` must be set and the `onClick` callback prop of the child `Step` components used to update the `activeStepIndex`.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Steps/Steps.stories.tsx)
 */
export const Steps = asRendition<
	React.ForwardRefExoticComponent<
		StepsProps & React.RefAttributes<HTMLDivElement>
	>
>(BaseSteps);
