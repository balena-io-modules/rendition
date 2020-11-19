import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';

import { rotate360 } from '../../animations';
import asRendition from '../../asRendition';
import { px } from '../../utils';
import { Flex } from '../Flex';
import { Txt } from '../Txt';

const CircleLoader = styled.div<Pick<InternalSpinnerProps, 'emphasized'>>`
	background: transparent !important;
	width: ${(props) => px(props.emphasized ? 40 : 20)};
	height: ${(props) => px(props.emphasized ? 40 : 20)};
	border: ${(props) => px(props.emphasized ? 6 : 4)} solid;
	color: ${(props) => props.theme.colors.tertiary.main};
	border-radius: 100%;
	border-bottom-color: transparent;
	display: inline-block;
	animation: ${rotate360} 1s 0s infinite linear;
	animation-fill-mode: both;
`;

const Container = styled.div`
	position: relative;
`;

const SpinnerContainer = styled(Flex)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 4;
`;

const ChildrenContainer = styled.div<Pick<InternalSpinnerProps, 'show'>>`
	opacity: ${(props) => (props.show ? 0.4 : 1)};
	transition: opacity 250ms;
	z-index: 3;
`;

const Base = ({
	label,
	emphasized,
	...otherProps
}: Omit<InternalSpinnerProps, 'show'>) => {
	return (
		<Flex
			flexDirection={emphasized ? 'column' : 'row'}
			justifyContent="center"
			alignItems="center"
			width="fit-content"
			{...otherProps}
		>
			<CircleLoader emphasized={emphasized} />
			{label && (
				<Txt color="text.light" ml={emphasized ? 0 : 2} mt={emphasized ? 2 : 0}>
					{label}
				</Txt>
			)}
		</Flex>
	);
};

const BaseSpinner = ({
	show = true,
	emphasized,
	label,
	children,
	...otherProps
}: InternalSpinnerProps) => {
	if (!children) {
		if (!show) {
			return null;
		}

		return <Base label={label} emphasized={emphasized} {...otherProps} />;
	}

	return (
		<Container {...otherProps}>
			{show && (
				<SpinnerContainer justifyContent="center" alignItems="center">
					<Base label={label} emphasized={emphasized} />
				</SpinnerContainer>
			)}

			<ChildrenContainer show={show}>{children}</ChildrenContainer>
		</Container>
	);
};

interface InternalSpinnerProps extends React.HTMLAttributes<HTMLElement> {
	/** If passed, it will control whether the spinner is shown or not */
	show?: boolean;
	/** If true, it will render a large spinner */
	emphasized?: boolean;
	/** A label that will be rendered next to the spinner. Renders on right-hand side for standard spinner, and below spinner for emphasized */
	label?: string | React.ReactNode;
}

export type SpinnerProps = InternalSpinnerProps & RenditionSystemProps;

/** [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Spinner/Spinner.stories.tsx) */
export const Spinner = asRendition<React.FunctionComponent<SpinnerProps>>(
	BaseSpinner,
);
