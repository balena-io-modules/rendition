import { Grommet } from 'grommet';
import { PartialDeep } from 'lodash/index';
import merge from 'lodash/merge';
import * as React from 'react';
import styled from 'styled-components';
import { DefaultProps, Theme } from '../../common-types';
import defaultTheme from '../../theme';
import { px } from '../../utils';
import { BreakpointProvider } from './BreakpointProvider';
import { Helmet } from 'react-helmet';

const Base = styled(Grommet)`
	font-family: ${(props) => props.theme.font};
	font-size: ${(props) => px(props.theme.fontSizes[2])};
	color: ${(props) => px(props.theme.colors.text.main)};
`;

const Provider = ({ theme, ...props }: ThemedProvider) => {
	const providerTheme = merge(defaultTheme, theme);
	return (
		<BreakpointProvider breakpoints={providerTheme.breakpoints}>
			<Helmet>
				<link
					href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400&family=Ubuntu+Mono:wght@400;700&display=fallback"
					rel="stylesheet"
				/>
			</Helmet>
			<Base theme={providerTheme} {...props} />
		</BreakpointProvider>
	);
};

export interface ThemedProvider extends DefaultProps {
	theme?: PartialDeep<Theme>;
}

export default Provider;
