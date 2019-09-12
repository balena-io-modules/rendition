/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, List } from '../../../dist'

test('Unordered list renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <List>
        <span>Item 1</span>
        <span>Item 2</span>
      </List>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Ordered list renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <List ordered>
        <span>Item 1</span>
        <span>Item 2</span>
      </List>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
