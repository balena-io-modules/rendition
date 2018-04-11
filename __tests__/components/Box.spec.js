/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import { Box } from '../../src/components/Grid'

test('Box renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Box>A box</Box>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
