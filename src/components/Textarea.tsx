import * as React from 'react';
import { compose } from 'recompose';
import { TextareaProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { radius } from '../theme';
import { monospace, px } from '../utils';

const Base = styled.textarea`
	border-radius: ${px(radius)};
	font-size: inherit;
	border: 1px solid ${props => props.theme.colors.gray.main};
	padding: 8px 16px;
	resize: vertical;
	display: block;
	width: 100%;

	&:hover {
		box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
	}
	&::placeholder {
		color: ${props => props.theme.colors.gray.main};
	}

	${monospace as any};
`;

const Component = ({
	autoRows,
	maxRows,
	minRows,
	rows,
	...props
}: TextareaProps) => {
	let rowsProp = rows;

	if (autoRows && props.onChange) {
		rowsProp = (props.value || '').split('\n').length;
	}

	if (maxRows && (rowsProp || 0) > maxRows) {
		rowsProp = maxRows;
	}

	if (minRows && (rowsProp || 0) < minRows) {
		rowsProp = minRows;
	}

	return <Base rows={rowsProp} {...props} />;
};

export default compose(withTheme, asRendition)(
	Component,
) as React.ComponentClass<TextareaProps>;
