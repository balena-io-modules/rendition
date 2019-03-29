import * as React from 'react';
import styled, { StyledFunction, ThemeProvider } from 'styled-components';
import { DefaultProps, Theme } from '../common-types';
import defaultTheme from '../theme';

export interface ThemedBaseProps extends DefaultProps {
	theme?: Theme;
}

const Base = (styled.div as StyledFunction<DefaultProps>)`
  font-family: ${props => props.theme.font};
`;

const Provider = ({ theme, ...props }: ThemedBaseProps) => {
	return (
		<ThemeProvider theme={theme || defaultTheme}>
			<Base {...props} />
		</ThemeProvider>
	);
};

export default Provider;
