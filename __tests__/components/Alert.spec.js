/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Alert from '../../src/components/Alert'

test('Alert renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Alert>An alert</Alert>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
