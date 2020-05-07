/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { DropDownButton, Provider } from '../../../dist'

test('DropDownButton renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <DropDownButton primary label={<div>DropDown</div>}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropDownButton>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Opened DropDownButton renders correctly', () => {
  let componentInstance
  const component = renderer.create(
    <Provider>
      <DropDownButton
        primary
        ref={(ref) => {
          componentInstance = ref
        }}
        label={<div>DropDown</div>}
      >
        <div>Item</div>
        {[...Array(3).keys()].map((index) => (
          <div key={index}>Item</div>
        ))}
      </DropDownButton>
    </Provider>
  )

  componentInstance.setState({
    open: true
  })

  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
