import map from 'lodash/map';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, RenditionSystemProps } from '../common-types';

import asRendition from '../asRendition';
import { px } from '../utils';
import Divider from './Divider';
import { Box, Flex } from './Grid';
import Txt from './Txt';

const Wrapper = styled.div<{ minHeight?: string }>`
	border: solid 1px #dfdede;
	border-radius: ${props => px(props.theme.radius || 3)};
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
	padding: 20px;

	background-color: #ffffff;
	min-height: ${props => props.minHeight || 'auto'};
`;

const styledDivider = <Divider height={1} color="#dfdede" />;

const Card = ({ title, cta, rows, children, ...props }: InternalCardProps) => {
	const hasHeader = title || cta;

	const Header = hasHeader && (
		<React.Fragment>
			<Flex justifyContent="space-between" mb={14}>
				<Txt bold fontSize="16px" color="#000">
					{title}
				</Txt>
				{cta}
			</Flex>
			{styledDivider}
		</React.Fragment>
	);

	const Rows =
		rows &&
		map(rows, (row, index: number) => (
			<div key={index}>
				{index > 0 && styledDivider}
				{row}
			</div>
		));

	const Body = children && <Box mt={hasHeader ? 14 : 0}>{children}</Box>;

	return (
		<Wrapper {...props}>
			{Header}
			{Rows}
			{Body}
		</Wrapper>
	);
};

export interface InternalCardProps extends DefaultProps {
	title?: string;
	cta?: JSX.Element;
	rows?: JSX.Element[];
	children?: any;
	minHeight?: string;
}

export type CardProps = InternalCardProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<CardProps>>(Card);
