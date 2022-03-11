import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { OpenApiJson } from './openApiJson';
import { Flex, FlexProps } from '../../components/Flex';
import { Txt } from '../../components/Txt';
import { findInObject } from '../AutoUI/utils';

const SidebarWrapper = styled(Flex)`
	overflow: auto;
	background: ${(props) => props.theme.colors.secondary.main};
	flex-direction: column;
	flex-wrap: nowrap;
`;

const MenuItem = styled(Flex)<{ isCurrent: boolean }>`
	height: 48px;
	cursor: pointer;
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
			: props.theme.colors.secondary.dark};

	&:hover {
		background: ${(props) =>
			props.isCurrent
				? props.theme.colors.quartenary.light
				: props.theme.colors.tertiary.dark};
	}
`;

interface SidebarProps {
	openApiJson: OpenApiJson;
	isCollapsed: boolean;
}

export const Sidebar = ({
	openApiJson,
	isCollapsed = false,
	...flexProps
}: SidebarProps & FlexProps) => {
	const { pathname } = useLocation();
	const menuItems = React.useMemo(
		() =>
			Object.entries(openApiJson.components.schemas)
				.filter(
					([key, value]) =>
						!key.endsWith('-create') &&
						!key.endsWith('-update') &&
						!!value.title &&
						!findInObject(value, '$ref'),
				) // add !findInObject(value, '$ref')
				.map(([key, value]) => ({
					resource: key.substring(key.indexOf('.') + 1),
					title: value.title?.split('_')?.join(' '),
				})),
		[openApiJson],
	);
	return (
		<SidebarWrapper {...flexProps}>
			{menuItems.map((item) => {
				const isCurrent = pathname.split('/').some((i) => i === item.resource);

				return (
					<NavLink key={item.resource} to={`/${item.resource}`}>
						<MenuItem
							width="100%"
							isCurrent={isCurrent}
							px={3}
							py={2}
							flexDirection="row"
							alignItems="center"
						>
							<Txt.span
								bold
								fontSize={2}
								style={{ lineHeight: 1.33 }}
								color={isCurrent ? 'text.main' : 'quartenary.main'}
								display={isCollapsed ? 'none' : undefined}
								truncate
								tooltip={item.title}
							>
								{item.title}
							</Txt.span>
						</MenuItem>
					</NavLink>
				);
			})}
		</SidebarWrapper>
	);
};
