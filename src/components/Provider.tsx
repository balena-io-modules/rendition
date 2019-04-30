import { Grommet } from 'grommet';
import merge = require('lodash/merge');
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Theme } from '../common-types';
import defaultTheme from '../theme';

const Base = styled.div<ThemedProvider>`
	font-family: ${props => props.theme.font};

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	label,
	button {
		font-family: ${props => props.theme.titleFont};
	}
`;

const Provider = ({ theme, ...props }: ThemedProvider) => {
	return (
		<Grommet theme={merge(defaultTheme, theme)}>
			<Base {...props} />
		</Grommet>
	);
};

export interface ThemedProvider extends DefaultProps {
	theme?: Theme;
}

export default Provider;
