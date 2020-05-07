/* globals expect, describe, it */
import { mount } from 'enzyme'
import noop from 'lodash/noop'
import sinon from 'sinon'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, Select } from '../../../dist'

describe('Select component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Select options={['Option 1', 'Option 2', 'Option 3']} />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('value property', () => {
    it('should set the value of the select element', () => {
      const component = mount(
        <Provider>
          <Select
            value={'Option 1'}
            onChange={noop}
            options={['Option 1', 'Option 2', 'Option 3']}
          />
        </Provider>
      )

      expect(component.find('input[value="Option 1"]')).toHaveLength(1)
    })
  })

  describe('onChange property', () => {
    it('should set be called when the select element value is changed', () => {
      const value = 'Option 2'
      const spy = sinon.spy()
      const component = mount(
        <Provider>
          <Select
            onChange={spy}
            options={['Option 1', 'Option 2', 'Option 3']}
          />
        </Provider>
      )

      // Open the select drop
      component.find('button').at(0).simulate('click')

      // Choose the second option
      component.find('button').at(2).simulate('click')

      expect(spy.callCount).toEqual(1)
      expect(spy.firstCall.args[0].option).toEqual(value)
    })
  })
})
