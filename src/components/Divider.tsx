import styled from 'styled-components';
import asRendition from '../asRendition';
import { DefaultProps } from '../common-types';
import { px } from '../utils';

export interface DividerProps extends DefaultProps {
	height?: number;
	color?: string;
}
const Base = styled.hr<DividerProps & React.HTMLProps<HTMLInputElement>>`
	border: none;
	height: ${props => px(props.height || 2)};
	background-color: ${props => props.color || '#333'};
`;

export default asRendition<DividerProps>(Base, [], ['color']);
