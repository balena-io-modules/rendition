/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Divider, Provider } from '../../../dist'

test('Divider renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Divider />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
