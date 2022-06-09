import map from 'lodash/map';
import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { Divider } from '../Divider';
import { Flex, FlexProps } from '../Flex';
import { Heading } from '../Heading';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const Wrapper = styled(DismissableContainer)<WrapperProps>`
	& {
		padding: ${(props) => (props.small ? '24px' : '32px 44px')};
	}
`;

const BaseCard = ({
	title,
	cta,
	rows,
	children,
	small,
	...props
}: InternalCardProps) => {
	const hasHeader = title || cta;
	const isSmall = useBreakpoint(small);

	const Header = hasHeader && (
		<React.Fragment>
			<Flex justifyContent="space-between" alignItems="center">
				<Heading.h5 fontSize={4}>{title}</Heading.h5>
				{cta}
			</Flex>
			<Divider my={2} />
		</React.Fragment>
	);

	const Rows =
		rows &&
		map(rows, (row, index: number) => (
			<Flex key={index} fontSize={2} flexDirection="column" flexWrap="wrap">
				{index > 0 && <Divider />}
				{row}
			</Flex>
		));

	const Body = children && (
		<Flex fontSize={2} flex={1} flexDirection="column" flexWrap="wrap">
			{children}
		</Flex>
	);

	return (
		<Wrapper
			small={isSmall}
			flexDirection="column"
			alignItems="stretch"
			{...props}
		>
			{Header}
			{Rows}
			{Body}
		</Wrapper>
	);
};

interface WrapperProps extends FlexProps {
	small?: boolean | boolean[];
}

export interface InternalCardProps extends WrapperProps {
	/** The title of the card */
	title?: string;
	/** React component added to the header */
	cta?: JSX.Element;
	/** Subsections separated by a horizontal separator */
	rows?: JSX.Element[];
	/** Any content that is internally wrapped in a Box */
	children?: any;
}

export type CardProps = InternalCardProps & RenditionSystemProps;

/**
 * Section containing content and actions on the same topic.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Card/Card.stories.tsx)
 */
export const Card = asRendition<React.FunctionComponent<CardProps>>(BaseCard);
