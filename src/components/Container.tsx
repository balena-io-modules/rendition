import assign = require('lodash/assign');
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import {
	maxWidth,
	MaxWidthProps,
	textAlign,
	TextAlignProps,
} from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../common-types';

const ContainerBase = styled.div<ThemedContainerProps>`
	${textAlign}
	${maxWidth}
`;

const Container = (props: ThemedContainerProps) => {
	return (
		<ContainerBase
			{...props}
			maxWidth={props.theme.breakpoints.map(
				(bp, i) => `${bp - props.theme.space[i]}em`,
			)}
		/>
	);
};

Container.displayName = 'Container';
Container.defaultProps = {} as any;

const setDefaultProps = withProps((props: InternalContainerProps) => {
	return assign(
		{
			px: 3,
			ml: 'auto',
			mr: 'auto',
		},
		props,
	);
});

export interface InternalContainerProps
	extends DefaultProps,
		MaxWidthProps,
		TextAlignProps {}
export interface ThemedContainerProps extends InternalContainerProps {
	theme: Theme;
}

export type ContainerProps = InternalContainerProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<ContainerProps>>(Container, [
	setDefaultProps,
]);
