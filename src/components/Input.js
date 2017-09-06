import { h } from 'preact'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import { radius } from '../theme'
import { compose } from 'recompose'

const Base = styled.input`
  border-radius: ${px(radius)};
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};
  font-size: inherit;
  border: 1px solid ${props => props.theme.colors.gray.main};
  padding: 0px 16px;

  &:hover {
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  }
  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: ${props => props.theme.colors.gray.main};
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: ${props => props.theme.colors.gray.main};
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: ${props => props.theme.colors.gray.main};
  }
  &:-moz-placeholder {
    /* Firefox 18- */
    color: ${props => props.theme.colors.gray.main};
  }
`

export default compose(withTheme, hoc)(Base)