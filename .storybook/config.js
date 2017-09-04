import { configure, setAddon, addDecorator } from '@storybook/react'
import infoAddon from '@storybook/addon-info'
import { h } from 'preact'
import { Provider } from '../src/index'
import theme from '../src/theme'
import { injectGlobal } from 'styled-components'

injectGlobal([], {
  '*': {
    boxSizing: 'border-box'
  },
  body: {
    lineHeight: 1.5,
    margin: 0,
    fontFamily : theme.font
  }
})

setAddon(infoAddon)

addDecorator(story => (
  <Provider>
    {story()}
  </Provider>
))

const req = require.context('../src', true, /\.js$/)

const load = () => {
  req.keys().forEach(req)
}

configure(load, module)
