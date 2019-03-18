import { Box as _Box, Flex as _Flex } from '@balena/grid-styled';
import { compose } from 'recompose';
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

export const Flex = compose(asRendition)(FlexBase) as React.ComponentClass<
	FlexProps
>;
export const Box = compose(asRendition)(BoxBase) as React.ComponentClass<
	BoxProps
>;
