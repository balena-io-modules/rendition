/* globals expect, test */
import { mount } from 'enzyme'
import React from 'react'
import { Provider, useTheme } from '../../dist'

const Sample = () => {
  const theme = useTheme()

  return <span>{theme.foo}</span>
}

test('useTheme should return correct theme object', () => {
  const theme = {
    foo: 'bar'
  }

  const component = mount(
    <Provider theme={theme}>
      <Sample />
    </Provider>
  )
  let text = component.find(Sample).text()
  expect(text).toEqual('bar')
})
