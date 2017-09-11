import { h } from 'preact'
import { FaClose } from 'react-icons/lib/fa'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { compose } from 'recompose'

const BtnWrapper = styled.button`
  border: 0;
  background: none;
  padding: 4px;
  font-size: 14px;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;

  &:hover {
    color: black;
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
