import * as React from 'react';
import styled from 'styled-components';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { default as InternalErrorBoundary } from '../../internal/ErrorBoundary';
import { Box } from '../Box';
import { Sidebar, SidebarProps } from '../Sidebar';
import { Header, HeaderProps } from './Header';

export interface LayoutProps {
	header?:
		| JSX.Element
		| HeaderProps
		| ((
				isSidebarCollapsed?: boolean,
				setIsSidebarCollapsed?: (state: boolean) => void,
		  ) => JSX.Element);
	footer?: JSX.Element;
	leftSider?:
		| JSX.Element
		| SidebarProps
		| ((
				isSidebarCollapsed?: boolean,
				setIsSidebarCollapsed?: (state: boolean) => void,
		  ) => JSX.Element);
	contentHeader?: JSX.Element;
	children: JSX.Element;
	ErrorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
	isSidebarCollapsed?: boolean;
	setIsSidebarCollapsed?: (state: boolean) => void;
}

const Grid = styled(Box)<{
	gridTemplateAreas: string;
	gridTemplateRows: string;
	gridTemplateColumns: string;
}>`
	display: grid;
	grid-template-areas: ${(props) => props.gridTemplateAreas};
	grid-template-rows: ${(props) => props.gridTemplateRows};
	grid-template-columns: ${(props) => props.gridTemplateColumns};
`;

const GridItem = styled(Box)<{ gridArea: string }>`
	grid-area: ${(props) => props.gridArea};
`;

export const Layout = ({
	header,
	footer,
	leftSider,
	contentHeader,
	children,
	ErrorBoundary,
	isSidebarCollapsed,
	setIsSidebarCollapsed,
}: LayoutProps) => {
	const templateAreas = `
		"leftSider header"
		"leftSider contentHeader"
		"leftSider content"
		"footer footer"
	`;

	const templateRows = `
		[header header] max-content
		[contentHeader] max-content
		[content] minmax(0,1fr)
		[footer footer] max-content
	`;

	const templateColumns = `
		[leftSider] max-content
		[content] minmax(0, 1fr)
	`;

	const mobile = useBreakpoint([true, true, false]);
	const [collapsed, setCollapsed] = React.useState(true);

	React.useEffect(() => {
		if (mobile) {
			(setIsSidebarCollapsed ?? setCollapsed)(true);
		} else {
			(setIsSidebarCollapsed ?? setCollapsed)(false);
		}
	}, [mobile]);

	const ErrorBoundaryComponent = React.useCallback(
		({ children }: { children: JSX.Element }) => {
			return ErrorBoundary ? (
				<ErrorBoundary>{children}</ErrorBoundary>
			) : (
				<InternalErrorBoundary>{children}</InternalErrorBoundary>
			);
		},
		[ErrorBoundary],
	);

	return (
		<Grid
			bg="transparent"
			height="100%"
			gridTemplateAreas={templateAreas.trim()}
			gridTemplateRows={templateRows.trim()}
			gridTemplateColumns={templateColumns}
		>
			{header && (
				<GridItem gridArea="header">
					<ErrorBoundaryComponent>
						{React.isValidElement(header) ? (
							header
						) : typeof header === 'object' ? (
							<Header
								isSidebarCollapsed={isSidebarCollapsed ?? collapsed}
								setIsSidebarCollapsed={setIsSidebarCollapsed ?? setCollapsed}
								{...(header as HeaderProps)}
							/>
						) : (
							header(
								isSidebarCollapsed ?? collapsed,
								setIsSidebarCollapsed ?? setCollapsed,
							)
						)}
					</ErrorBoundaryComponent>
				</GridItem>
			)}
			{leftSider && (
				<GridItem
					style={{
						overflowY: 'auto',
					}}
					gridArea="leftSider"
				>
					{React.isValidElement(leftSider) ? (
						leftSider
					) : typeof leftSider === 'object' ? (
						<ErrorBoundaryComponent>
							<Sidebar
								{...(!mobile && {
									isCollapsed: isSidebarCollapsed ?? collapsed,
									setIsCollapsed: setIsSidebarCollapsed ?? setCollapsed,
								})}
								{...(leftSider as SidebarProps)}
							/>
						</ErrorBoundaryComponent>
					) : (
						leftSider(
							isSidebarCollapsed ?? collapsed,
							setIsSidebarCollapsed ?? setCollapsed,
						)
					)}
				</GridItem>
			)}
			{contentHeader && (
				<GridItem gridArea="contentHeader">
					{<ErrorBoundaryComponent>{contentHeader}</ErrorBoundaryComponent>}
				</GridItem>
			)}
			<GridItem
				style={{
					flexDirection: 'column',
					display: 'flex',
					overflowY: 'auto',
				}}
				gridArea="content"
			>
				<ErrorBoundaryComponent>{children}</ErrorBoundaryComponent>
			</GridItem>
			{footer && (
				<GridItem gridArea="footer">
					<ErrorBoundaryComponent>{footer}</ErrorBoundaryComponent>
				</GridItem>
			)}
		</Grid>
	);
};
