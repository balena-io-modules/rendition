import * as get from 'lodash/get'
import * as omit from 'lodash/omit'
import * as React from 'react'
import styled from 'styled-components'
import { color, fontSize, space } from 'styled-system'
import { align, bold, caps } from './Text'
import asRendition from '../asRendition'
import { darken, monospace } from '../utils'

let Base = styled.a`
  ${align}
  ${color}
  ${fontSize}
  ${monospace};
  ${space}

  ${caps}
  ${bold}

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

export default asRendition(Link)
