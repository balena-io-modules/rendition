import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { Divider } from '../Divider';
import { Flex, FlexProps } from '../Flex';
import { Heading } from '../Heading';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button, ButtonProps } from '../Button';

const Wrapper = styled(DismissableContainer)<WrapperProps>`
	& {
		padding: ${(props) => (props.small ? '24px' : '32px 44px')};
	}
`;

const BaseCard = ({
	title,
	cta,
	children,
	small,
	actions,
	showDivider = true,
	...props
}: InternalCardProps) => {
	const hasHeader = title || cta;
	const isSmall = useBreakpoint(small);

	const Header = hasHeader && (
		<React.Fragment>
			<Flex flex="0 0 auto" justifyContent="space-between" alignItems="center">
				<Heading.h3>{title}</Heading.h3>
				{cta}
			</Flex>
			<Divider my={2} color={!showDivider ? 'transparent' : undefined} />
		</React.Fragment>
	);

	const Body = children && (
		<Flex flex="1" flexDirection="column" fontSize={2}>
			{children}
		</Flex>
	);

	const Footer = actions && (
		<Flex flex="0 0 auto" justifyContent="flex-end">
			{actions.map((actionProps, index) => (
				<Button ml={index === 0 ? 0 : 2} {...actionProps} />
			))}
		</Flex>
	);

	return (
		<Wrapper small={isSmall} {...props}>
			<Flex flexDirection="column" flex="1">
				{Header}
				{Body}
				{Footer}
			</Flex>
		</Wrapper>
	);
};

interface WrapperProps extends FlexProps {
	small?: boolean | boolean[];
}

export interface InternalCardProps extends Omit<WrapperProps, 'title'> {
	/** The title of the card */
	title?: string | JSX.Element;
	/** React component added to the header */
	cta?: JSX.Element;
	/** Any content that is internally wrapped in a Box */
	children?: any;
	/** Buttons placed on the bottom of the card */
	actions?: ButtonProps[];
	/** Show or hide main divider */
	showDivider?: boolean;
}

export type CardProps = InternalCardProps & RenditionSystemProps;

/**
 * Section containing content and actions on the same topic.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Card/Card.stories.tsx)
 */
export const Card = asRendition<React.FunctionComponent<CardProps>>(BaseCard);
