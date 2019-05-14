/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Flex,
  Provider
} from '../../dist'

test('Flex renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Flex>Flex</Flex>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
