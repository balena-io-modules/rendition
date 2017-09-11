import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import { radius } from '../theme'
import { compose } from 'recompose'

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
`

export default compose(withTheme, hoc)(Base)
