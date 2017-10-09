import { h } from 'preact'
import Text from './Text'
import get from 'lodash/get'
import omit from 'lodash/omit'
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
