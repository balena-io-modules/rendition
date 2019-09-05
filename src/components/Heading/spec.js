/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Heading, Provider } from '../../../dist'

test('Heading renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Heading>Heading</Heading>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
