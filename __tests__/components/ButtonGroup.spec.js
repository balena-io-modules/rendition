/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Button from '../../src/components/Button'
import ButtonGroup from '../../src/components/ButtonGroup'

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
