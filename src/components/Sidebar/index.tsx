import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, FlexProps } from '../Flex';
import { Breadcrumbs, Crumb } from '../Breadcrumbs';
import { Button } from '../Button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { Menu, MenuItem } from './Menu';

export interface SidebarProps extends FlexProps {
	menuItems: MenuItem[];
	navLink: React.FC<{ to: string }>;
	crumbs?: Crumb[];
	showBreadcrumbs?: boolean;
	isCollapsed?: boolean;
	additionalComponents?: JSX.Element | null;
	setIsCollapsed?: (isCollapsed: boolean) => void;
}

export const Sidebar = ({
	menuItems,
	crumbs,
	showBreadcrumbs = true,
	isCollapsed = false,
	additionalComponents,
	setIsCollapsed,
	navLink,
	...props
}: SidebarProps) => {
	return (
		<Flex
			flexDirection="column"
			flexWrap="nowrap"
			backgroundColor="secondary.main"
			{...props}
		>
			{showBreadcrumbs && !!crumbs && (
				<Flex pl={isCollapsed ? 15 : 24} pr={1} mb={3} mt={20}>
					<Breadcrumbs crumbs={crumbs} isCollapsed={isCollapsed} />
				</Flex>
			)}
			<Menu
				flex="1"
				ml={!isCollapsed && showBreadcrumbs && !!crumbs ? 32 : 0}
				flexDirection="column"
				style={{ overflowX: 'auto' }}
				items={menuItems}
				isCollapsed={isCollapsed}
				navLink={navLink}
			/>
			<Flex justifyContent="space-between" alignItems="center" mb={3} px={2}>
				{additionalComponents}
				{!!setIsCollapsed && isCollapsed != null && (
					<Button
						height="38px"
						width="38px"
						color="text.light"
						icon={
							<FontAwesomeIcon
								icon={isCollapsed ? faChevronRight : faChevronLeft}
							/>
						}
						onClick={() => setIsCollapsed(!isCollapsed)}
						style={{
							background: 'rgba(0, 0, 0, 0.1)',
							borderRadius: '2px',
						}}
					/>
				)}
			</Flex>
		</Flex>
	);
};
