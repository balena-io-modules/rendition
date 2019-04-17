import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { DefaultProps, Theme } from '../common-types';
import defaultTheme from '../theme';

const Base = styled.div<ThemedProvider>`
	font-family: ${props => props.theme.font};
`;

export interface ThemedProvider extends DefaultProps {
	theme?: Theme;
}

const Provider = ({ theme, ...props }: ThemedProvider) => {
	return (
		<ThemeProvider theme={theme || defaultTheme}>
			<Base {...props} />
		</ThemeProvider>
	);
};

export default Provider;
