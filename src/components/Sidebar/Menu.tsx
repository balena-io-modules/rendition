import React from 'react';
import styled from 'styled-components';
import { Badge, InternalBadgeProps } from '../Badge';
import { Flex, FlexProps } from '../Flex';
import { Txt } from '../Txt';

export interface MenuItem {
	className?: string;
	href: string;
	title: string;
	disabled?: boolean;
	tooltip?: string;
	badge?: InternalBadgeProps;
	icon?: React.ReactNode;
}

const StyledBadge = styled(Badge)<{ isCollapsed: boolean }>`
	border-radius: 0 1em 1em 0;
	position: absolute;
	transform: scale(0.75);
	left: -5%;
	bottom: 5%;
	${(props) =>
		props.isCollapsed &&
		`
			left: -15%;
			height: 1.675em;
		`}
`;

const MenuItem = styled(Flex)<{ isCurrent: boolean; disabled?: boolean }>`
	height: 48px;
	cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
	border-bottom: 1px solid
		${(props) =>
			props.isCurrent
				? props.theme.colors.quartenary.light
				: props.theme.colors.tertiary.dark};
	border-left: ${(props) =>
		props.isCurrent ? `2px solid ${props.theme.colors.primary.main}` : 'none'};
	background: ${(props) =>
		props.isCurrent
			? props.theme.colors.quartenary.light
			: props.disabled
			? props.theme.colors.quartenary.dark
			: props.theme.colors.secondary.dark};

	&:hover {
		background: ${(props) =>
			props.isCurrent
				? props.theme.colors.quartenary.light
				: props.disabled
				? props.theme.colors.quartenary.dark
				: props.theme.colors.tertiary.dark};
	}
	position: relative;
`;

export const Menu = ({
	items,
	isCollapsed,
	navLink: NavLink,
	...props
}: {
	items: MenuItem[];
	navLink: React.FC<{ to: string }>;
	isCollapsed: boolean;
} & FlexProps) => {
	const { pathname } = window.location;

	const currentItem = React.useMemo(() => {
		return (
			items.find((item) => pathname === item.href) ||
			items.find((item) => pathname.startsWith(item.href))
		);
	}, [items, pathname]);

	const MenuItemWrapper = ({
		disabled,
		children,
		...props
	}: {
		disabled?: boolean;
		to: string;
		children: any;
	}) => (disabled ? <>{children}</> : <NavLink {...props}>{children}</NavLink>);

	return (
		<Flex flexDirection="column" {...props}>
			{items.map((item) => {
				const isCurrent = currentItem === item;
				return (
					<MenuItemWrapper
						key={item.href}
						to={item.href}
						disabled={item.disabled}
					>
						<MenuItem
							className={item.className}
							width="100%"
							isCurrent={isCurrent}
							px={3}
							py={2}
							flexDirection="row"
							alignItems="center"
							justifyContent={isCollapsed ? 'center' : 'unset'}
							disabled={item.disabled}
							tooltip={
								item.tooltip != null
									? { text: item.tooltip, placement: 'right' }
									: undefined
							}
						>
							{!!item.badge && (
								<StyledBadge {...item.badge} isCollapsed={isCollapsed}>
									{isCollapsed ? '' : item.badge.children}
								</StyledBadge>
							)}
							{!!item.icon && (
								<Txt.span
									bold
									color={
										isCurrent || item.disabled
											? 'text.main'
											: 'secondary.semilight'
									}
									fontSize={isCollapsed ? 4 : 3}
									mr={isCollapsed ? 0 : 2}
								>
									{item.icon}
								</Txt.span>
							)}
							{!isCollapsed && (
								<Txt.span
									bold
									fontSize={2}
									style={{ lineHeight: 1.33 }}
									color={
										isCurrent || item.disabled ? 'text.main' : 'quartenary.main'
									}
								>
									{item.title}
								</Txt.span>
							)}
							{!item.icon && isCollapsed && (
								<Txt.span
									bold
									tooltip={item.title}
									color={
										isCurrent || item.disabled
											? 'text.main'
											: 'secondary.semilight'
									}
									fontSize={4}
									ml={1}
								>
									{item.title.charAt(0).toUpperCase()}
								</Txt.span>
							)}
						</MenuItem>
					</MenuItemWrapper>
				);
			})}
		</Flex>
	);
};
