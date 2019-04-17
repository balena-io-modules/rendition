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
import { Theme } from '../common-types';

interface ContainerProps extends MaxWidthProps, TextAlignProps {}
interface ThemedContainerProps extends ContainerProps {
	theme: Theme;
}

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

const setDefaultProps = withProps((props: ContainerProps) => {
	return assign(
		{
			px: 3,
			ml: 'auto',
			mr: 'auto',
		},
		props,
	);
});

export default asRendition<ContainerProps>(Container, [setDefaultProps]);
