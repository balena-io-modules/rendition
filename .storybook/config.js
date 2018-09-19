import { configure, setAddon, addDecorator } from '@storybook/react'
import * as React from 'react'
import { initScreenshot, setScreenshotOptions } from 'storybook-chrome-screenshot'
import { injectGlobal } from 'styled-components'
import theme from '../src/theme'

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

addDecorator(initScreenshot())

// The 'fontLoading' global is defined in '.storybook/preview-head.html' and
// returns a promise that resolves once fonts have loaded. Waiting until the
// fonts have loaded means we should get consistent screenshots across all
// systems, otherwise a screenshot could be rendered using the incorrect font
// and cause a conflict
setScreenshotOptions({
  waitFor: 'fontLoading',
})

const req = require.context('../src', true, /\.js$/)

const load = () => {
  req.keys().forEach(req)
}

configure(load, module)
