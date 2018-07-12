import * as React from 'react';
import styled from 'styled-components';

export const LegendElement = styled.legend`
	font-size: 11px;
	color: #252629;
	text-transform: uppercase;
	display: inline-block;
	margin-bottom: 6px;
`;

export const TitleField = ({
	id,
	required,
	title,
}: {
	id: string;
	required: boolean;
	title?: string;
}) => {
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
