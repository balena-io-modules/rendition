import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { px } from '../utils'
import { compose } from 'recompose'

const Base = styled.hr`
  border: none;
  height: ${props => px(props.height || 2)};
  background-color: ${props => props.color || '#333'};
`

export default compose(withTheme, hoc)(Base)
