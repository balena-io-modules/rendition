import { compose } from 'recompose';
import styled, { StyledFunction, withTheme } from 'styled-components';
import hoc from '../hoc';
import { px } from '../utils';

interface DividerProps {
	height?: number;
}

const Base = (styled.hr as StyledFunction<
	DividerProps & React.HTMLProps<HTMLInputElement>
>)`
	border: none;
	height: ${props => px(props.height || 2)};
	background-color: ${props => props.color || '#333'};
`;

export default compose(withTheme, hoc)(Base);
