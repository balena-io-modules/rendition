/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { HighlightedName, Provider } from '../../../dist'

test('HighlightedName renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <HighlightedName>HighlightedName</HighlightedName>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
