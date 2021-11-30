import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Router, Switch, Route } from 'react-router-dom';
import { Content } from './Content';
import { createGlobalStyle } from 'styled-components';
import { Provider } from '../..';
import { history } from '../AutoUI/utils';
import { Flex } from '../../components/Flex';
import { Box } from '../../components/Box';
import { OpenApiJson } from './openApiJson';

const SIDEBAR_WIDTH = '166px';
const NAVBAR_HEIGHT = '60px';

const GlobalStyle = createGlobalStyle`
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}
`;

// tslint:disable-next-line no-namespace
declare global {
	interface Window {
		REACT_APP_API_HOST: string;
		REACT_APP_TITLE: string;
	}
}

export interface AutoUIAppProps {
	openApiJson: OpenApiJson;
	title: string;
	logo?: string;
}

export const AutoUIApp = ({ openApiJson, title, logo }: AutoUIAppProps) => {
	return (
		<Provider>
			<Router history={history}>
				<GlobalStyle />
				<Navbar height={NAVBAR_HEIGHT} title={title} logo={logo} />
				<Flex>
					<Sidebar
						width={SIDEBAR_WIDTH}
						height={`calc(100vh - ${NAVBAR_HEIGHT})`}
						openApiJson={openApiJson}
						isCollapsed={false}
					/>
					<Box
						width={`calc(100vw - ${SIDEBAR_WIDTH})`}
						height={`calc(100vh - ${NAVBAR_HEIGHT})`}
						px={2}
						py={1}
						style={{ overflow: 'auto' }}
					>
						<Switch>
							{Object.keys(openApiJson.paths).map((path) => (
								<Route
									key={path}
									path={path}
									render={() => <Content openApiJson={openApiJson} />}
								/>
							))}
						</Switch>
					</Box>
				</Flex>
			</Router>
		</Provider>
	);
};
