import map from 'lodash/map';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, RenditionSystemProps } from '../../common-types';

import asRendition from '../../asRendition';
import { DismissableContainer } from '../../internal/DismissableContainer';
import { Box } from '../Box';
import Divider from '../Divider';
import { Flex } from '../Flex';
import Heading from '../Heading';

const Wrapper = styled(DismissableContainer)<WrapperProps>`
	& {
		min-height: ${props => props.minHeight || 'auto'};
		padding: ${props => (props.small ? '24px' : '32px 44px')};
	}
`;

const Card = ({ title, cta, rows, children, ...props }: InternalCardProps) => {
	const hasHeader = title || cta;

	const Header = hasHeader && (
		<React.Fragment>
			<Flex justifyContent="space-between" alignItems="center">
				<Heading.h5 fontSize={2}>{title}</Heading.h5>
				{cta}
			</Flex>
			<Divider my={2} />
		</React.Fragment>
	);

	const Rows =
		rows &&
		map(rows, (row, index: number) => (
			<Box key={index}>
				{index > 0 && <Divider />}
				{row}
			</Box>
		));

	const Body = children && <Box>{children}</Box>;

	return (
		<Wrapper {...props}>
			<Box width="100%">
				{Header}
				{Rows}
				{Body}
			</Box>
		</Wrapper>
	);
};

interface WrapperProps extends DefaultProps {
	minHeight?: string;
	small?: boolean;
}

export interface InternalCardProps extends WrapperProps {
	title?: string;
	cta?: JSX.Element;
	rows?: JSX.Element[];
	children?: any;
}

export type CardProps = InternalCardProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<CardProps>>(Card);
