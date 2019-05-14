/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Button,
  ButtonGroup,
  Provider
} from '../../dist'

test('ButtonGroup renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
