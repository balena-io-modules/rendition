import { Box as _Box, Flex as _Flex } from '@balena/grid-styled';
import { compose } from 'recompose';
import styled from 'styled-components';
import { color, fontSize } from 'styled-system';
import asRendition from '../asRendition';
import { DefaultProps, Tooltip } from '../common-types';

export interface FlexProps extends BoxProps {
	align?: string | string[];
	justify?: string | string[];
	flexDirection?: string | string[];
	wrap?: boolean | boolean[] | string;
}

export interface BoxProps extends DefaultProps, Tooltip {
	flex?: string | string[];
	order?: number | string | Array<number | string>;
}

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
