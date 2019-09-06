/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Badge, Provider } from '../../../dist'

test('Badge renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Badge>Badge</Badge>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
