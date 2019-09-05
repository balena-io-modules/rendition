/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Checkbox, Provider } from '../../../dist'

test('Checkbox renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Checkbox checked />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
