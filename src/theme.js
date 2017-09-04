import { lighten, darken, blacken, fade } from './utils'

const primary = '#2297DE'
const secondary = '#FFC523'
const tertiary = '#4D5057'
const quartenary = '#EBEFF4'

const danger = '#FF423D'
const warning = '#FCA321'
const success = '#76C950'
const info = '#1496E1'

export const colors = {
  primary: {
    main: primary,
    light: lighten(primary),
    dark: darken(primary)
  },
  secondary: {
    main: secondary,
    light: lighten(secondary),
    dark: darken(secondary)
  },
  tertiary: {
    main: tertiary,
    light: lighten(tertiary),
    dark: darken(tertiary)
  },
  quartenary: {
    main: quartenary,
    light: lighten(quartenary),
    // Can't quite replicate this programatically :(
    dark: '#d3d7dc'
  },

  danger: {
    main: danger,
    light: fade(danger),
    dark: blacken(danger)
  },
  warning: {
    main: warning,
    light: fade(warning),
    dark: blacken(warning)
  },
  success: {
    main: success,
    light: fade(success),
    dark: blacken(success)
  },
  info: {
    main: info,
    light: fade(info),
    dark: blacken(info)
  },

  text: {
    main: '#3c3e42',
    light: '#8f9297'
  },

  gray: {
    light: '#f4f4f4',
    main: '#c6c8c9',
    dark: '#9f9f9f'
  }
}

export const breakpoints = [32, 48, 64, 80]

export const space = [0, 4, 8, 16, 32, 64, 128]

export const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 72, 96]

export const weights = [400, 700]

export const radius = 4
export const font = `Roboto, Arial, sans-serif`
export const monospace = `'Ubuntu Mono Web', 'Courier New', monospace`

export const defaultControlHeight = 36
export const emphasizedControlHeight = 45

export default {
  breakpoints,
  space,
  fontSizes,
  weights,
  font,
  monospace,
  colors,
  radius
}
