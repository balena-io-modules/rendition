import Color from 'color'
import get from 'lodash/get'

export const lighten = color =>
  Color(color)
    .fade(0.3)
    .string()

export const darken = color =>
  Color(color)
    .darken(0.2)
    .string()

export const fade = color =>
  Color(color)
    .fade(0.95)
    .string()

export const blacken = color =>
  Color(color)
    .darken(0.6)
    .string()

export const bold = props => get(props.theme, 'weights.1')

export const px = n => (typeof n === 'number' ? n + 'px' : n)

export const randomString = (length = 16) => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
