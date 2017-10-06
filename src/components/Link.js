import { h } from 'preact'
import Text from './Text'
import get from 'lodash/get'
import { darken } from '../utils'

let Base = Text.extend`
  text-decoration: ${props => props.decor || 'none'};
  cursor: pointer;
  display: inline-block;

  &:active,
  &:hover {
    color: ${props =>
    darken(get(props.theme.colors, props.color) || props.color)};
  }
`

const Link = ({ is, blank, ...props }) => {
  if (is) {
    Base = Base.withComponent(is)
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
