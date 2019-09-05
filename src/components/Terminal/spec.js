/* globals expect, jest, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, Terminal } from '../../../dist'

// Terminal implements xterm.js v3, which uses window.matchMedia
// This API is not supported by jsDom, so we have to mock it here
const matchMediaMock = require('match-media-mock').create()
matchMediaMock.setConfig({ type: 'screen', width: 1200 })

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(matchMediaMock)
})

test('Terminal renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Terminal>Terminal</Terminal>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
