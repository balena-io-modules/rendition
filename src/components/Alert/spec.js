/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Alert, Provider } from '../../../dist'

test('Alert renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Alert>An alert</Alert>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
