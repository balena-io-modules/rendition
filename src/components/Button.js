import styled, { withTheme } from 'styled-components'
import hoc from '../hoc'
import { bold, px, darken } from '../utils'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import { h } from 'preact'

const getColorFromTheme = theme => colorString => {
  // allows for dot notation like 'secondary.dark'
  return get(theme, `colors.${colorString}`)
}

const getType = props => {
  // get primary, tertiary, secondary etc
  const type = Object.keys(props).find(b =>
    Object.keys(props.theme.colors).find(k => k === b)
  )
  return type
}

const getColor = (props, key, shade) => {
  if (props[key]) {
    return props[key]
  }
  const type = getType(props)
  if (type) {
    const color = getColorFromTheme(props.theme)(type)
    if (isObject(color)) {
      return color[shade]
    } else {
      return color
    }
  }
}

const minWidth = props => {
  if (props.w == null && !props.square) {
    return 135
  }
  if (props.square) {
    return props.emphasized ? props.theme.space[5] : props.theme.space[4]
  }

  return props.w
}

const Button = styled.button`
  padding-top: 1px;
  font-family: inherit;
  display: inline-block;
  font-weight: ${props => bold(props)};
  border-radius: ${props => px(props.theme.radius)};
  appearance: none;
  text-decoration: none;
  border: 0;
  margin: 0;
  min-width: ${props => px(minWidth(props))};
  vertical-align: middle;
  font-size: inherit;
  line-height: 1.1;
  text-align: center;
  cursor: pointer;
  background: ${props => props.bg || getColor(props, 'bg', 'main')};
  color: ${props => props.color || '#fff'};
  height: ${props =>
    px(props.emphasized ? props.theme.space[5] : props.theme.space[4])};

  &:hover,
  &:focus,
  &:active {
    color: #fff;
    background-color: ${props =>
    getColor(props, 'bg', 'dark') || darken(props.color)};
  }

  '&:disabled': {
    opacity: 1/4;
  }
`

const Outline = Button.extend`
  color: ${props =>
    getColor(props, 'color', 'main') || props.theme.colors.text.main};
  background: ${props => props.color || 'none'};
  border: 1px solid;
`

const Underline = Outline.extend`
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid;

  &:hover,
  &:focus,
  &:active {
    background: none;
    color: ${props =>
    getColor(props, 'color', 'main') || props.theme.colors.text.main};
    box-shadow: 0px -1px 0 0px inset;
  }
`

export default withTheme(
  hoc(({ outline, underline, ...props }) => {
    if (outline) {
      return <Outline {...props} />
    } else if (underline) {
      return <Underline {...props} />
    } else if (!getType(props) && !props.color && !props.bg) {
      // outline tertiary is our default btn
      return <Outline {...props} tertiary />
    } else {
      return <Button {...props} />
    }
  })
)
