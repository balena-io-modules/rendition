import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import theme from '../../theme';
import { Box, BoxProps } from '../Box';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import styled from 'styled-components';

const BaseHeader = styled(Box)`
	z-index: 12;
	position: relative;
	width: 100%;
`;

export interface HeaderProps extends BoxProps {
	rightContent?: JSX.Element[];
	leftContent?: JSX.Element[];
	isSidebarCollapsed?: boolean;
	setIsSidebarCollapsed?: (isSidebarCollapsed: boolean) => void;
}

export const Header = ({
	rightContent,
	leftContent,
	isSidebarCollapsed,
	setIsSidebarCollapsed,
	...props
}: HeaderProps) => (
	<BaseHeader width="100%" backgroundColor="secondary.main" {...props}>
		<Flex justifyContent="space-between" mx={3}>
			<Flex justifyContent="space-between" alignItems="center" ml={0} mr="auto">
				{setIsSidebarCollapsed && (
					<Button
						plain
						color={theme.colors.quartenary.main}
						ml="auto"
						display={['block', 'block', 'none']}
						onClick={() => {
							setIsSidebarCollapsed(!isSidebarCollapsed);
						}}
						aria-label="Toggle navigation"
						fontSize={5}
					>
						<FontAwesomeIcon icon={faBars} />
					</Button>
				)}
				{leftContent}
			</Flex>
			<Flex justifyContent="space-between" alignItems="center" ml="auto" mr={0}>
				{rightContent}
			</Flex>
		</Flex>
	</BaseHeader>
);
