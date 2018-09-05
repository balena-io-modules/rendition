import { Box as _Box, Flex as _Flex } from 'grid-styled';
import * as React from 'react';
import { compose, withProps } from 'recompose';
import { BoxProps, FlexProps } from 'rendition';
import styled from 'styled-components';
import { color, fontSize } from 'styled-system';
import asRendition from '../asRendition';

const FlexBase = styled(_Flex)`
	${fontSize} ${color};
`;

const BoxBase = styled(_Box)`
	${fontSize} ${color};
`;

const normalizeProps = withProps(
	({ align, justify, wrap, ...props }: FlexProps) => {
		if (align || justify || wrap) {
			console.warn(
				'The align, justify and wrap properties are deprecated and will be removed in rendition v5. Please use alignItems, justifyContent and flexWrap instead.',
			);
		}
		return {
			alignItems: align,
			justifyContent: justify,
			flexWrap: wrap,
			...props,
		};
	},
);

export const Flex = compose(asRendition, normalizeProps)(
	FlexBase,
) as React.ComponentClass<FlexProps>;
export const Box = compose(asRendition)(BoxBase) as React.ComponentClass<
	BoxProps
>;
