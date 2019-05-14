/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Provider,
  Txt
} from '../../dist'

test('Txt renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Txt>Hello world</Txt>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
