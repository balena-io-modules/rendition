import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { compose, withProps } from 'recompose'
import defaultTo from 'lodash/defaultTo'

const Base = styled.div`
  position: fixed;
  top: ${props => defaultTo(props.top, 0)};
  right: ${props => defaultTo(props.right, 0)};
  bottom: ${props => defaultTo(props.bottom, 0)};
  left: ${props => defaultTo(props.left, 0)};
  z-index: ${props => defaultTo(props.z, 0)};
  background: ${props => defaultTo(props.bg, 'none')};
`

const dimensions = withProps(props => {
  return {
    top: props.top === true ? 0 : props.top,
    right: props.right === true ? 0 : props.right,
    bottom: props.bottom === true ? 0 : props.bottom,
    left: props.left === true ? 0 : props.left
  }
})

export default compose(withTheme, dimensions, hoc)(Base)
