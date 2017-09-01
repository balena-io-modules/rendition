import Color from 'color'

const lighten = color =>
  Color(color)
    .fade(0.3)
    .string()

const darken = color =>
  Color(color)
    .darken(0.2)
    .string()

const fade = color =>
  Color(color)
    .fade(0.95)
    .string()

const blacken = color =>
  Color(color)
    .darken(0.6)
    .string()

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
  }
}
