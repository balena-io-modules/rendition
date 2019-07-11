import styled from 'styled-components';
import asRendition from '../asRendition';
import {
	DefaultProps,
	RenditionSystemProps,
	Sizing,
	Theme,
} from '../common-types';
import { radius } from '../theme';
import { monospace, opaque, px } from '../utils';

const getColor = (props: ThemedInputProps): any => {
	if (props.invalid) {
		return props.theme.colors.danger.main;
	}
	if (props.valid) {
		return props.theme.colors.success.main;
	}

	return props.theme.colors.quartenary.main;
};

const getHeight = (props: ThemedInputProps) => (props.emphasized ? 48 : 38);

const getSpinButtonMargin = (props: ThemedInputProps) =>
	(getHeight(props) - 2 - 20) / 2;

const Base = styled.input`
	border-radius: ${px(radius)};
	height: ${props => px(getHeight(props))};
	color: ${props => props.theme.colors.secondary.main};
	font-size: inherit;
	border: 1px solid ${getColor};
	padding: 0px 16px;
	box-sizing: border-box;

	&[disabled] {
		border-color: ${props => opaque(props.theme.colors.quartenary.main, 0.4)};
		cursor: not-allowed;
	}
	&:focus:enabled {
		border-color: ${props => props.theme.colors.tertiary.main};
		outline: none;
	}
	&:hover:enabled {
		box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
	}
	&::placeholder {
		color: ${props => props.theme.colors.secondary.semilight};
	}

	&[type='checkbox'] {
		height: auto;
		font-size: ${props => px(props.theme.fontSizes[1])};
	}

	&[type='date' i],
	&[type='datetime-local' i],
	&[type='month' i],
	&[type='time' i],
	&[type='week' i] {
		&::-webkit-inner-spin-button {
			height: 20px;
			margin-top: ${props => px(getSpinButtonMargin(props))};
		}
	}

	${monospace};
`;

export interface InternalInputProps extends DefaultProps, Sizing {
	monospace?: boolean;
	autoComplete?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	form?: string;
	max?: number | string;
	maxLength?: number;
	min?: number | string;
	minLength?: number;
	name?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	type?: string;
	value?: string | string[] | number;
	pattern?: string;

	invalid?: boolean;
	valid?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface ThemedInputProps extends InternalInputProps {
	theme: Theme;
}

export type InputProps = InternalInputProps & RenditionSystemProps;

export default asRendition<
	React.ForwardRefExoticComponent<
		InputProps & React.RefAttributes<HTMLInputElement>
	>
>(Base);
