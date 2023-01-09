import * as React from 'react';
import styled from 'styled-components';
import { default as InternalErrorBoundary } from '../../internal/ErrorBoundary';
import { Box } from '../Box';
import { Sidebar, SidebarProps } from '../Sidebar';

export interface LayoutProps {
	header?: JSX.Element;
	footer?: JSX.Element;
	leftSider?: JSX.Element | SidebarProps;
	contentHeader?: JSX.Element;
	children: JSX.Element;
	ErrorBoundary?: any; // TODO
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

	return (
		<Grid
			bg="transparent"
			height="100%"
			gridTemplateAreas={templateAreas.trim()}
			gridTemplateRows={templateRows.trim()}
			gridTemplateColumns={templateColumns}
		>
			{header && <GridItem gridArea="header">{header}</GridItem>}
			{leftSider && (
				<GridItem
					style={{
						overflowY: 'auto',
					}}
					gridArea="leftSider"
				>
					{React.isValidElement(leftSider) ? (
						leftSider
					) : ErrorBoundary ? (
						<ErrorBoundary>
							<Sidebar {...(leftSider as SidebarProps)} />
						</ErrorBoundary>
					) : (
						<InternalErrorBoundary>
							<Sidebar {...(leftSider as SidebarProps)} />
						</InternalErrorBoundary>
					)}
				</GridItem>
			)}
			{contentHeader && (
				<GridItem gridArea="contentHeader">{contentHeader}</GridItem>
			)}
			<GridItem
				style={{
					flexDirection: 'column',
					display: 'flex',
					overflowY: 'auto',
				}}
				gridArea="content"
			>
				{children}
			</GridItem>
			{footer && <GridItem gridArea="footer">{footer}</GridItem>}
		</Grid>
	);
};
