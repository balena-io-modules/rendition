import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Router, Switch, Route } from 'react-router-dom';
import { Content } from './Content';
import { createGlobalStyle } from 'styled-components';
import { Provider } from '../..';
import { history, onClickOutOrEsc } from '../AutoUI/utils';
import { Flex } from '../../components/Flex';
import { Box } from '../../components/Box';
import { OpenApiJson } from './openApiJson';
import { ActionSidebar, ActionSidebarProps } from './ActionSidebar';
import { Authentication, authPaths } from './Authentication';

// TODO: remove!
window.REACT_APP_AUTHENTICATION_PROCESS = true;

const SIDEBAR_WIDTH = 166;
const NAVBAR_HEIGHT = 60;
export const ACTION_SIDEBAR_WIDTH = 340;

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
		OPEN_API_ODATA_JSON_PATH: string;
		REACT_APP_API_HOST: string;
		REACT_APP_AUTHENTICATION_PROCESS: boolean;
		REACT_APP_TITLE: string;
	}
}

export enum ActionMethods {
	POST = 'post',
	PATCH = 'patch',
	DELETE = 'delete',
}

export interface AutoUIAppProps {
	openApiJson: OpenApiJson;
	title: string;
	logo?: string;
}

export const AutoUIApp = ({ openApiJson, title, logo }: AutoUIAppProps) => {
	const actionSidebarWrapper = React.useRef<HTMLDivElement>(null);
	const [actionSidebar, setActionSidebar] = React.useState<Omit<
		ActionSidebarProps,
		'openApiJson'
	> | null>();
	const [server] = openApiJson.servers ?? [];
	const apiHost = server?.url + '/';

	React.useEffect(() => {
		if (!actionSidebarWrapper.current) {
			return;
		}
		onClickOutOrEsc(actionSidebarWrapper.current, () => {
			setActionSidebar(null);
		});
	}, [actionSidebarWrapper.current]);

	return (
		<Provider>
			<Router history={history}>
				<GlobalStyle />
				<Navbar height={NAVBAR_HEIGHT} title={title} logo={logo} />
				<Flex style={{ position: 'relative' }}>
					<Sidebar
						width={`${SIDEBAR_WIDTH}px`}
						height={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
						openApiJson={openApiJson}
						isCollapsed={false}
					/>
					<Box
						width={`calc(100vw - ${
							actionSidebar
								? SIDEBAR_WIDTH + ACTION_SIDEBAR_WIDTH
								: SIDEBAR_WIDTH
						}px)`}
						height={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
						px={2}
						py={1}
						style={{ overflow: 'auto' }}
					>
						<Switch>
							{window.REACT_APP_AUTHENTICATION_PROCESS &&
								Object.keys(authPaths).map((path) => (
									<Route
										key={path}
										path={path}
										render={({ location }) => (
											<Authentication location={location} />
										)}
									/>
								))}
							{Object.keys(openApiJson.paths).map((path) => (
								<Route
									key={path}
									path={path}
									render={() => (
										<Content
											openApiJson={openApiJson}
											openActionSidebar={setActionSidebar}
											apiHost={apiHost}
										/>
									)}
								/>
							))}
						</Switch>
					</Box>
					{actionSidebar && (
						<Flex ref={actionSidebarWrapper}>
							<ActionSidebar
								{...actionSidebar}
								openApiJson={openApiJson}
								apiHost={apiHost}
								onClose={() => setActionSidebar(null)}
							/>
						</Flex>
					)}
				</Flex>
			</Router>
		</Provider>
	);
};
