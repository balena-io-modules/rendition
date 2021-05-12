import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Button } from '../../components/Button';
import { Input, InputProps } from '../../components/Input';
import styled from 'styled-components';

const Container = styled.div`
	position: relative;
`;

const HideButton = styled(Button)`
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translate(0, -50%);
`;

export const PasswordInput = (props: InputProps) => {
	const [showPassword, setShowPassword] = React.useState(false);
	return (
		<Container>
			<Input
				{...props}
				mb={0}
				pr={5}
				type={showPassword ? 'text' : 'password'}
			/>
			<HideButton
				plain
				icon={
					showPassword ? (
						<FontAwesomeIcon icon={faEye} />
					) : (
						<FontAwesomeIcon icon={faEyeSlash} />
					)
				}
				onClick={() => setShowPassword((x) => !x)}
			/>
		</Container>
	);
};
