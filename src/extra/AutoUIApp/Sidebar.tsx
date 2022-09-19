import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { OpenApiJson } from './openApiJson';
import { FlexProps } from '../../components/Flex';
import { Crumb } from '../../components/Breadcrumbs';
import { Sidebar as SidebarBase } from '../../components/Sidebar';
import { MenuItem } from '../../components/Sidebar/Menu';

interface SidebarProps {
	openApiJson: OpenApiJson;
	isCollapsed: boolean;
}

export const Sidebar = ({
	openApiJson,
	isCollapsed = false,
}: SidebarProps & FlexProps) => {
	const { pathname } = useLocation();
	const history = useHistory();
	const crumbs = React.useMemo(() => {
		const handleCrumbClick = (event: React.MouseEvent, href: string) => {
			if (!event.ctrlKey && !event.metaKey) {
				event.preventDefault();
				history.push(href);
			}
		};
		const paths = pathname
			?.split('/')
			?.slice(1)
			.map((path) => path.split('_').join(' '));
		if (paths.length <= 1 || isCollapsed) {
			return [];
		}
		return paths.map((path, index) => {
			const href: string = `/${paths.slice(0, index + 1).join('/')}`;
			return {
				text: path,
				href,
				onClick: (event: React.MouseEvent) => handleCrumbClick(event, href),
			};
		}) as Crumb[];
	}, [pathname, isCollapsed, history]);

	const menuItems = React.useMemo(() => {
		if (pathname.split('/').length > 2) {
			return [{ href: pathname, title: 'Summary' }] as MenuItem[];
		}
		return Object.entries(openApiJson.components.schemas)
			.filter(
				([key, value]) =>
					!key.endsWith('-create') && !key.endsWith('-update') && !!value.title,
			) // add !findInObject(value, '$ref')
			.map(([key, value]) => ({
				href: `/${key.substring(key.indexOf('.') + 1)}`,
				title: value.title?.split('_')?.join(' '),
			})) as MenuItem[];
	}, [openApiJson, pathname]);
	return (
		<SidebarBase
			crumbs={crumbs}
			showBreadcrumbs={true}
			menuItems={menuItems}
			isCollapsed={isCollapsed}
		/>
	);
};
