import { Grommet } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Theme } from '../common-types';
import defaultTheme from '../theme';

const Base = styled.div<ThemedProvider>`
	font-family: ${props => props.theme.font};
`;

const Provider = ({ theme, ...props }: ThemedProvider) => {
	return (
		<Grommet theme={theme || defaultTheme}>
			<Base {...props} />
		</Grommet>
	);
};

export interface ThemedProvider extends DefaultProps {
	theme?: Theme;
}

export default Provider;
