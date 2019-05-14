/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Img,
  Provider
} from '../../dist'

test('Img renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Img />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
