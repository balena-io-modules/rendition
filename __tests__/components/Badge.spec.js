/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Badge from '../../src/components/Badge'

test('Badge renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Badge text='badge' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
