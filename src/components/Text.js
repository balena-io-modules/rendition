import { h } from 'preact'
import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { font } from '../theme'
import { compose } from 'recompose'

const Base = styled.p`
  font-family: ${font};
  font-size: inherit;
`

export default compose(withTheme, hoc)(Base)
