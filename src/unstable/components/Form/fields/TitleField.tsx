import * as React from 'react';
import styled from 'styled-components';
import { px } from '../../../../utils';

export const LegendElement = styled.legend`
	font-size: ${props => px(props.theme.fontSizes[3])};
	color: #252629;
	margin-top: 16px;
	margin-bottom: 8px;
	border-bottom: 1px solid ${props => px(props.theme.colors.gray.light)};
	width: 100%;
`;

export const TitleField = (props: {
	id: string;
	required: boolean;
	title?: string;
}) => {
	const { id, required, title } = props;
	if (!title) {
		return null;
	}

	return (
		<LegendElement id={id}>
			{title}
			{required && '*'}
		</LegendElement>
	);
};
