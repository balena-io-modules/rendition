import assign from 'lodash/assign';
import last from 'lodash/last';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import {
	maxWidth,
	MaxWidthProps,
	textAlign,
	TextAlignProps,
} from 'styled-system';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps, Theme } from '../../common-types';
import { px } from '../../utils';

const ContainerBase = styled.div<ThemedContainerProps>`
	${textAlign}
	${maxWidth}
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
