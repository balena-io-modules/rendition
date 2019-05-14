/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Provider,
  Search
} from '../../dist'

test('Search renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Search placeholder='Placeholder Text' />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
