import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { compose } from 'recompose'

const Base = styled.hr`color: ${props => props.color || '#333'};`

export default compose(withTheme, hoc)(Base)
