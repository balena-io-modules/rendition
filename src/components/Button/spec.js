/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import sinon from 'sinon'
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

test('onClick is called after confirmation', () => {
  const handleClick = sinon.spy()

  const component = mount(
    <Provider>
      <Button confirmation={'Sure?'} onClick={handleClick} m={2}>
        Click me
      </Button>
    </Provider>
  )

  // Popup should not be visible until button is clicked
  expect(component.find('Popover Box[children="Sure?"]')).toHaveLength(0)

  // Open the confirmation
  component.find('button[children="Click me"]').simulate('click')

  // Popup should become visible
  expect(component.find('Popover Box[children="Sure?"]')).toHaveLength(1)

  // Press Cancel
  component.find('button[children="Cancel"]').simulate('click')

  // onClick should not be called
  expect(handleClick.callCount).toEqual(0)

  // Open the confirmation
  component.find('button[children="Click me"]').simulate('click')

  // Press OK
  component.find('button[children="OK"]').simulate('click')

  // onClick should be called with an event
  expect(handleClick.callCount).toEqual(1)
  expect(handleClick.lastCall.args[0]).toHaveProperty('target')
})
