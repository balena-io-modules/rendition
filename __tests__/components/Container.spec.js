/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Container,
  Provider
} from '../../dist'

test('Container renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Container>Container</Container>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
