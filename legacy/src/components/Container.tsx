import * as React from 'react';
import { DefaultProps, Theme } from 'rendition';
import styled, { withTheme } from 'styled-components';
import {
	color,
	fontSize,
	responsiveStyle,
	space,
	textAlign,
} from 'styled-system';

const maxWidth = responsiveStyle('max-width', 'maxWidth');

const Container = styled.div`
  ${textAlign} ${maxWidth} ${fontSize} ${space} ${color};
` as React.ComponentClass<DefaultProps & { maxWidth?: string[] }>;

Container.displayName = 'Container';
Container.defaultProps = {
	px: 3,
	ml: 'auto',
	mr: 'auto',
} as any;

export default withTheme(
	({ theme, ...props }: DefaultProps & { theme: Theme }) => {
		return (
			<Container
				{...props}
				maxWidth={theme.breakpoints.map((bp, i) => `${bp - theme.space[i]}em`)}
			/>
		);
	},
) as React.ComponentClass<DefaultProps>;
