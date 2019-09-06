/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Card, Provider } from '../../../dist'

test('Search renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Card>Lorem ipsum dolor so ammet</Card>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
