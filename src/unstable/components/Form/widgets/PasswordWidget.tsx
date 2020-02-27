import * as React from 'react';
import styled from 'styled-components';
import { px } from '../../../../utils';
import { FormWidgetProps } from '../../../unstable-typings';

const STRENGTH_TITLES = ['Very weak', 'Weak', 'Good', 'Strong', 'Very strong'];
const STRENGTH_STYLES = [
	{ width: 0 },
	{ width: '25%', backgroundColor: 'orange' },
	{ width: '50%', backgroundColor: 'yellow' },
	{ width: '75%', backgroundColor: 'green' },
	{ width: '100%', backgroundColor: 'darkgreen' },
];

const PasswordStrengthContainer = styled.div`
	padding-bottom: ${props => px(props.theme.space[1])};
	position: relative;
	margin-top: ${props => px(props.theme.space[2])};
	margin-bottom: ${props => px(props.theme.space[3])};
	font-size: ${props => px(props.theme.fontSizes[0])};
`;

const PasswordStrengthMeter = styled.div`
	transition: all ease-out 150ms;
	position: absolute;
	height: 4px;
	background-color: red;
	min-width: 5px;
	bottom: 0;
`;

const PasswordStrengthText = styled.p`
	margin: 0;
	margin-bottom: ${props => px(props.theme.space[2])};
`;

export interface PasswordStrengthProps {
	password?: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
	const [strengthScore, setStrengthScore] = React.useState<
		number | undefined
	>();

	React.useEffect(() => {
		// @ts-ignore If you wish to show a stength meter, you need to load and set `zxcvbn` to a window variable by yourself.
		const zxcvbn = window.zxcvbn;

		if (zxcvbn && password) {
			try {
				const { score } = zxcvbn(password);
				setStrengthScore(score);
			} catch {
				// Ignore any errors, as we only want to show the strength meter if it is available.
			}
		}
	}, [password]);

	if (!password || strengthScore === undefined) {
		return null;
	}

	return (
		<PasswordStrengthContainer>
			<PasswordStrengthText>
				Password strength: <em>{STRENGTH_TITLES[strengthScore]}</em>
			</PasswordStrengthText>
			<PasswordStrengthMeter
				style={STRENGTH_STYLES[strengthScore]}
			></PasswordStrengthMeter>
		</PasswordStrengthContainer>
	);
};

const PasswordWidget = (props: FormWidgetProps) => {
	const { BaseInput } = props.registry.widgets;

	return (
		<>
			<BaseInput type="password" {...props} />
			{props.options.showPasswordStrengthMeter && (
				<PasswordStrength password={props.value} />
			)}
		</>
	);
};

export default PasswordWidget;
