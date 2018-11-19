import { compose } from 'recompose';
import { InputProps } from 'rendition';
import styled, { StyledFunction, withTheme } from 'styled-components';
import asRendition from '../asRendition';
import { radius } from '../theme';
import { monospace, px } from '../utils';

interface ThemedInputProps extends InputProps {
	theme: Theme;
}

const getColor = (props: ThemedInputProps): any => {
	if (props.invalid) {
		return props.theme.colors.danger.main;
	}
	if (props.valid) {
		return props.theme.colors.success.main;
	}
	if (props.disabled) {
		return props.theme.colors.gray.light;
	}
	return props.theme.colors.gray.main;
};

const getHeight = (props: ThemedInputProps) =>
	props.emphasized ? props.theme.space[5] : props.theme.space[4];

const getSpinButtonMargin = (props: ThemedInputProps) =>
	(getHeight(props) - 2 - 20) / 2;

const Base = (styled.input as StyledFunction<InputProps>)`
  border-radius: ${px(radius)};
  height: ${props => px(getHeight(props))};
  font-size: inherit;
  border: 1px solid ${getColor};
  padding: 0px 16px;

  &[disabled] {
    background-color: ${props => props.theme.colors.gray.light};
  }
  &:focus {
    border-color: ${props => props.theme.colors.secondary.main};
  }
  &:hover {
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  }
  &::placeholder {
    color: ${props => props.theme.colors.gray.main};
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

  ${monospace as any};
`;

export default compose(withTheme, asRendition)(Base) as React.ComponentClass<
	InputProps
>;
