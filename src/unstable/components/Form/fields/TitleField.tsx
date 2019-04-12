import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../../../asRendition';
import { DefaultProps, Theme } from '../../../../common-types';
import { px } from '../../../../utils';

export const LegendElement = styled.legend`
	font-size: ${props => px(props.theme.fontSizes[3])};
	color: #252629;
	margin-top: 16px;
	margin-bottom: 8px;
	border-bottom: 1px solid ${props => px(props.theme.colors.gray.light)};
	width: 100%;
`;

export interface TitleFieldProps extends DefaultProps {
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
