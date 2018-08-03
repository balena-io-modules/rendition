import { configure, setAddon, addDecorator } from '@storybook/react'
import * as React from 'react'
import theme from '../src/theme'
import { injectGlobal } from 'styled-components'

injectGlobal([], {
  '*': {
    boxSizing: 'border-box'
  },
  body: {
    lineHeight: 1.5,
    margin: 0,
    fontFamily: theme.font
  }
})

const req = require.context('../src', true, /\.js$/)

const load = () => {
  req.keys().forEach(req)
}

configure(load, module)
