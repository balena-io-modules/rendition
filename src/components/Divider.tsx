import { compose } from 'recompose';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps } from '../common-types';
import { px } from '../utils';

export interface DividerProps extends DefaultProps {
	height?: number;
	color?: string;
}

const Base = (styled.hr as StyledFunction<
	DividerProps & React.HTMLProps<HTMLInputElement>
>)`
	border: none;
	height: ${props => px(props.height || 2)};
	background-color: ${props => props.color || '#333'};
`;

export default compose(
	withTheme,
	asRendition,
)(Base) as React.ComponentClass<DividerProps>;
