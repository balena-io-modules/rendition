import { Grommet, GrommetProps } from 'grommet';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import * as React from 'react';
import styled from 'styled-components';
import { Theme } from '../../common-types';
import defaultTheme from '../../theme';
import { px } from '../../utils';
import { BreakpointProvider } from './BreakpointProvider';
import { Helmet } from 'react-helmet';

const Base = styled(Grommet)`
	font-family: ${(props) => props.theme.font};
	font-size: ${(props) => px(props.theme.fontSizes[2])};
	color: ${(props) => px(props.theme.colors.text.main)};
`;

const BaseProvider = ({ theme, ...props }: ThemedProvider) => {
	const isDefaultFont = !theme?.font;
	const providerTheme = merge(cloneDeep(defaultTheme), theme);

	return (
		<BreakpointProvider breakpoints={providerTheme.breakpoints}>
			{isDefaultFont && (
				<Helmet>
					<link
						href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400&family=Ubuntu+Mono:wght@400;700&display=fallback"
						rel="stylesheet"
					/>
				</Helmet>
			)}
			<Base theme={providerTheme} {...props} />
		</BreakpointProvider>
	);
};

export interface ThemedProvider
	extends Omit<React.HTMLAttributes<HTMLElement>, 'dir'> {
	theme?: Partial<Theme>;
	dir?: GrommetProps['dir'];
}

export const Provider = BaseProvider;
