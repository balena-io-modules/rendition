/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Divider from '../../src/components/Divider'

test('Divider renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Divider />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
