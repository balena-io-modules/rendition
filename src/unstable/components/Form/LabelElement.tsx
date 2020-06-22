import styled from 'styled-components';
import { px } from '../../../utils';

export const LabelElement = styled.label`
	display: inline-block;
	font-size: ${(props) => px(props.theme.fontSizes[1])};
	margin-bottom: ${(props) => px(props.theme.space[1])};
	color: ${(props) => props.theme.colors.secondary.main};
`;
