import { compose } from 'recompose';
import { DividerProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { px } from '../utils';

const Base = (styled.hr as StyledFunction<
	DividerProps & React.HTMLProps<HTMLInputElement>
>)`
	border: none;
	height: ${props => px(props.height || 2)};
	background-color: ${props => props.color || '#333'};
`;

export default compose(withTheme, asRendition)(Base) as React.ComponentClass<
	DividerProps
>;
