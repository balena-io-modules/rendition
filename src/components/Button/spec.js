/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Button, Provider } from '../../../dist'

test('Button renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Button>Click me</Button>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Styled Button renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Button m={2}>Click me</Button>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Styled Anchor Button renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Button href={'#'} m={2}>
        Click me
      </Button>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
