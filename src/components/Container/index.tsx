import last from 'lodash/last';
import * as React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';
import { textAlign, TextAlignProps } from 'styled-system';
import asRendition from '../../asRendition';
import { RenditionSystemProps, Theme } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';

const ContainerBase = styled(Box)<ThemedContainerProps>`
	${textAlign}
`;

const BaseContainer = (props: ThemedContainerProps) => {
	const gutter = props.theme.space[3];
	const upperLimit = last(props.theme.breakpoints) as number;
	const maxWidth = px(upperLimit - gutter);

	return <ContainerBase {...props} maxWidth={maxWidth} />;
};

BaseContainer.displayName = 'Container';
BaseContainer.defaultProps = {} as any;

const setDefaultProps = withProps((props: InternalContainerProps) => {
	return Object.assign(
		{
			px: 3,
			ml: 'auto',
			mr: 'auto',
		},
		props,
	);
});

export interface InternalContainerProps
	extends React.HTMLAttributes<HTMLElement>,
		TextAlignProps {}
export interface ThemedContainerProps extends InternalContainerProps {
	theme: Theme;
}

export type ContainerProps = InternalContainerProps & RenditionSystemProps;

/**
 * A padded container with a responsive width.
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Container/Container.stories.tsx)
 */
export const Container = asRendition<React.FunctionComponent<ContainerProps>>(
	BaseContainer,
	[setDefaultProps],
);
