/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import sinon from 'sinon'
import Provider from '../../src/components/Provider'
import { Form } from '../../src/unstable/'

const schema = {
  type: 'object',
  properties: {
    Name: {
      title: 'Pokemon Name',
      type: 'string'
    }
  }
}

describe('Form component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Form schema={schema} />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('hideSubmitButton property', () => {
    it('should render a submit button if the property is not specified', () => {
      const component = mount(
        <Provider>
          <Form schema={schema} />
        </Provider>
      )

      expect(component.find('button')).toHaveLength(1)

      component.unmount()
    })

    it('should render a submit button if the property is falsey', () => {
      const component = mount(
        <Provider>
          <Form schema={schema} hideSubmitButton={false} />
        </Provider>
      )

      expect(component.find('button')).toHaveLength(1)

      component.unmount()
    })

    it('should not render a submit button if the property is truthey', () => {
      const component = mount(
        <Provider>
          <Form schema={schema} hideSubmitButton />
        </Provider>
      )

      expect(component.find('button')).toHaveLength(0)

      component.unmount()
    })
  })

  describe('submitButtonText property', () => {
    it('should change the text value of the submit button', () => {
      const submitText = 'Click me to submit this form'
      const component = mount(
        <Provider>
          <Form schema={schema} submitButtonText={submitText} />
        </Provider>
      )

      expect(component.find('button').text()).toEqual(submitText)

      component.unmount()
    })
  })

  describe('onSubmit property', () => {
    it('should be called when the submit button is clicked', (done) => {
      const value = 'Squirtle'
      const callback = sinon.spy()
      const component = mount(
        <Provider>
          <Form schema={schema} onSubmit={callback} />
        </Provider>
      )

      const input = component.find('input')
      input.simulate('change', { target: { value } })
      component.update()

      setTimeout(() => {
        component.find('form').simulate('submit')
        expect(callback.callCount).toEqual(1)
        expect(callback.getCall(0).args[0].formData).toEqual({ Name: value })
        done()
      }, 150)
    })
  })

  describe('onChange property', () => {
    it('should be called when an input field is changed', (done) => {
      const value = 'Squirtle'
      const callback = sinon.spy()
      const component = mount(
        <Provider>
          <Form schema={schema} onChange={callback} />
        </Provider>
      )

      const input = component.find('input')
      input.simulate('change', { target: { value } })
      component.update()

      setTimeout(() => {
        expect(callback.callCount).toEqual(1)
        expect(callback.getCall(0).args[0].formData).toEqual({ Name: value })
        done()
      }, 150)
    })
  })

  describe('value property', () => {
    it('should set the value of the relevant input field', () => {
      const value = { Name: 'Squirtle' }
      const component = mount(
        <Provider>
          <Form schema={schema} value={value} />
        </Provider>
      )

      const input = component.find('input')
      expect(input.props().value).toEqual('Squirtle')
    })

    it('should set the value if the value is changed after the component mounts', () => {
      const value = { Name: 'Squirtle' }
      const component = mount(
        <Form schema={schema} />
      )

      component.setProps({ value })

      const input = component.find('input')
      expect(input.props().value).toEqual('Squirtle')
    })
  })
})
