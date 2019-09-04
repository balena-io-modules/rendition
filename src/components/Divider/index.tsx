import styled from 'styled-components';
import asRendition from '../../asRendition';
import { DefaultProps, RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';

const Base = styled.hr<InternalDividerProps>`
	border: none;
	height: ${props => px(props.height || 2)};
	background-color: ${props =>
		props.color || props.theme.colors.tertiary.semilight};
`;

export interface InternalDividerProps extends DefaultProps {
	height?: number;
	color?: string;
}

export type DividerProps = InternalDividerProps & RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		DividerProps & React.RefAttributes<HTMLHRElement>
	>
>(Base, [], ['color']);
