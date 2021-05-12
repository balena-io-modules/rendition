import * as React from 'react';
import { Txt, TxtProps } from '../../components/Txt';
import styled from 'styled-components';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface QuestionMarkProps extends TxtProps {
	emphasized?: boolean;
}

const Wrapper = styled(Txt.span)`
	&:hover {
		color: ${(props) => props.theme.colors.tertiary.dark};
	}
`;

export const QuestionMark = ({
	emphasized,
	...restProps
}: QuestionMarkProps) => (
	<Wrapper
		fontSize={emphasized ? 3 : undefined}
		color="primary.main"
		ml={2}
		{...restProps}
	>
		<FontAwesomeIcon icon={faQuestionCircle} />
	</Wrapper>
);
