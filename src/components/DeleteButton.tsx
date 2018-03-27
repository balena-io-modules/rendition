import * as React from 'react';
import { FaClose } from 'react-icons/lib/fa';
import { compose } from 'recompose';
import { DefaultProps } from 'rendition';
import styled, { withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { darken } from '../utils';

const BtnWrapper = styled.button`
	border: 0;
	background: none;
	padding: 4px;
	font-size: 14px;
	margin-left: 5px;
	color: rgba(0, 0, 0, 0.4);
	cursor: pointer;

	&:hover {
		color: ${({ color }) => (color ? darken(color) : 'black')};
	}
`;

interface BaseProps extends DefaultProps {
	color?: string;
}

const Base = (props: BaseProps) => {
	return (
		<BtnWrapper {...props}>
			<FaClose />
		</BtnWrapper>
	);
};

export default compose(withTheme, asRendition)(Base) as React.ComponentClass<
	BaseProps
>;
