import { h } from 'preact'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import { colors, radius } from '../theme'
import { compose } from 'recompose'

const Base = styled.textarea`
  border-radius: ${px(radius)};
  font-size: inherit;
  border: 1px solid ${colors.gray.main};
  padding: 8px 16px;
  resize: vertical;
  display: block;
  width: 100%;

  &:hover {
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  }
  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: ${colors.gray.main};
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: ${colors.gray.main};
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: ${colors.gray.main};
  }
  &:-moz-placeholder {
    /* Firefox 18- */
    color: ${colors.gray.main};
  }
`

export default compose(withTheme, hoc)(Base)
