import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../../asRendition';
import { Theme } from '../../../common-types';
import { px } from '../../../utils';

export const LegendElement = styled.legend`
	font-size: ${(props) => px(props.theme.fontSizes[2])};
	color: #252629;
	margin-top: 16px;
	margin-bottom: 8px;
	width: 100%;
`;

export interface TitleFieldProps extends React.HTMLAttributes<HTMLElement> {
	id: string;
	required: boolean;
	title?: string;
}

const TitleFieldBase = (props: TitleFieldProps & { theme: Theme }) => {
	const { id, required, title, theme } = props;
	if (!title) {
		return null;
	}

	return (
		<LegendElement id={id} theme={theme}>
			{title}
			{required && '*'}
		</LegendElement>
	);
};

export const TitleField = asRendition<TitleFieldProps>(TitleFieldBase);
