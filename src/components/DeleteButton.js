import * as React from 'react'
import * as FaClose from 'react-icons/lib/fa/close'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { compose } from 'recompose'
import { darken } from '../utils'

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
`
const Base = props => {
  return (
    <BtnWrapper {...props}>
      <FaClose />
    </BtnWrapper>
  )
}
export default compose(withTheme, hoc)(Base)
