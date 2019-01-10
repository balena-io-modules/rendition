/* globals expect, describe, it */
import { mount } from 'enzyme'
import noop from 'lodash/noop'
import sinon from 'sinon'
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Select from '../../src/components/Select'

describe('Select component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Select>
          <option value={1}>Option 1</option>
          <option value={2}>Option 2</option>
          <option value={3}>Option 3</option>
        </Select>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('value property', () => {
    it('should set the value of the select element', () => {
      const component = mount(
        <Provider>
          <Select value={2} onChange={noop}>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
          </Select>
        </Provider>
      )

      expect(component.find('select').props().value).toEqual(2)
    })
  })

  describe('onChange property', () => {
    it('should set be called when the select element value is changed', () => {
      const value = 2
      const spy = sinon.spy()
      const component = mount(
        <Provider>
          <Select onChange={spy}>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
          </Select>
        </Provider>
      )

      component.find('select').simulate('change', { target: { value } })

      expect(spy.callCount).toEqual(1)
      expect(spy.firstCall.args[0].target.value).toEqual(value)
    })
  })
})
