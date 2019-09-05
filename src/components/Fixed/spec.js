/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Fixed, Provider } from '../../../dist'

test('Fixed renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Fixed>Fixed</Fixed>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
