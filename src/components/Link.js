import * as React from 'react'
import * as get from 'lodash/get'
import * as omit from 'lodash/omit'
import Text from './Text'
import { darken } from '../utils'

let Base = Text.extend`
  text-decoration: ${props => props.decor || 'none'};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.65 : 1)};
  display: inline-block;

  &:active,
  &:hover {
    color: ${props =>
    !props.disabled &&
      darken(get(props.theme.colors, props.color) || props.color)};
  }
`

const Link = ({ is, blank, ...props }) => {
  if (is) {
    Base = Base.withComponent(is)
  }
  if (props.disabled) {
    props = omit(props, 'href')
  }
  return (
    <Base {...props} rel={blank && 'noopener'} target={blank && '_blank'} />
  )
}

Link.defaultProps = {
  is: 'a',
  color: 'primary.main'
}

export default Link
