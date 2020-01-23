import assign from 'lodash/assign';
import last from 'lodash/last';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import { textAlign, TextAlignProps } from 'styled-system';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';

const ContainerBase = styled(Box)<ThemedContainerProps>`
	${textAlign}
`;

const Container = (props: ThemedContainerProps) => {
	const gutter = props.theme.space[3];
	const upperLimit = last(props.theme.breakpoints) as number;
	const maxWidth = px(upperLimit - gutter);

	return <ContainerBase {...props} maxWidth={maxWidth} />;
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

export interface InternalContainerProps extends DefaultProps, TextAlignProps {}
export interface ThemedContainerProps extends InternalContainerProps {
	theme: Theme;
}

export type ContainerProps = InternalContainerProps & RenditionSystemProps;

export default asRendition<React.FunctionComponent<ContainerProps>>(Container, [
	setDefaultProps,
]);
