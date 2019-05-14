/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  ProgressBar,
  Provider
} from '../../dist'

test('ProgressBar renders correctly', () => {
  const value = 50
  const component = renderer.create(
    <Provider>
      <ProgressBar value={value}>
        {value}%
      </ProgressBar>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
