import { h } from 'preact'
import Text from './Text'
import get from 'lodash/get'
import { darken } from '../utils'

const Base = Text.extend`
  cursor: pointer;

  &:active,
  &:hover {
    color: ${props =>
    darken(get(props.theme.colors, props.color) || props.color)};
  }
`

const Link = ({ is, to, blank, ...props }) => {
  const L = Base.withComponent(is)
  return (
    <L
      {...props}
      href={to}
      rel={blank && 'noopener'}
      target={blank && '_blank'}
    />
  )
}

Link.defaultProps = {
  is: 'a',
  color: 'primary.main'
}

export default Link
