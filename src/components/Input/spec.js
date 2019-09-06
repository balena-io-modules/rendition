/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Input, Provider } from '../../../dist'

test('Input renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Input placeholder='Placeholder Text' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
