import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { initScreenshot, setScreenshotOptions } from 'storybook-chrome-screenshot'
import { createGlobalStyle } from 'styled-components'
import theme from '../src/theme'
import 'circular-std'

const GlobalStyle = createGlobalStyle([], {
  '*': {
    boxSizing: 'border-box'
  },
  body: {
    lineHeight: 1.5,
    margin: 0,
    fontFamily: theme.font,
    background: 'white',
    webkitFontSmoothing: 'antialiased'
  }
})

function withGlobalStyles (storyFn) {
  return (
    <React.Fragment>
      <GlobalStyle />
      {storyFn()}
    </React.Fragment>
  )
}

addDecorator(withGlobalStyles)
addDecorator(initScreenshot())

// The 'fontLoading' global is defined in '.storybook/preview-head.html' and
// returns a promise that resolves once fonts have loaded. Waiting until the
// fonts have loaded means we should get consistent screenshots across all
// systems, otherwise a screenshot could be rendered using the incorrect font
// and cause a conflict
setScreenshotOptions({
  waitFor: 'fontLoading'
})

const req = require.context('../src', true, /\.js$/)

const load = () => {
  req.keys().forEach(req)
}

configure(load, module)
