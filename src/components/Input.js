import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { monospace, px } from '../utils'
import { radius } from '../theme'
import { compose } from 'recompose'

const getColor = props => {
  if (props.invalid) {
    return props.theme.colors.danger.main
  }
  if (props.valid) {
    return props.theme.colors.success.main
  }
  if (props.disabled) {
    return props.theme.colors.gray.light
  }
  return props.theme.colors.gray.main
}

const Base = styled.input`
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  font-size: inherit;
  border: 1px solid ${props => getColor(props)};
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

  ${monospace};
`

export default compose(withTheme, hoc)(Base)
