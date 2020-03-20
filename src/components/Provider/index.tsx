import { Grommet } from 'grommet';
import merge from 'lodash/merge';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Theme } from '../../common-types';
import defaultTheme from '../../theme';
import { px } from '../../utils';
import { BreakpointProvider } from './BreakpointProvider';

const Base = styled(Grommet)`
	font-family: ${props => props.theme.font};
	font-size: ${props => px(props.theme.fontSizes[1])};

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	button {
		font-family: ${props => props.theme.titleFont};
	}
`;

const Provider = ({ theme, ...props }: ThemedProvider) => {
	const providerTheme = merge(defaultTheme, theme);
	return (
		<BreakpointProvider breakpoints={providerTheme.breakpoints}>
			<Base theme={providerTheme} {...props} />
		</BreakpointProvider>
	);
};

export interface ThemedProvider extends DefaultProps {
	theme?: Partial<Theme>;
}

export default Provider;
