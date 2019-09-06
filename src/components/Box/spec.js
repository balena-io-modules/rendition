/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Box, Provider } from '../../../dist'

test('Box renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Box>A box</Box>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
