/* globals expect, describe, it */
import Promise from 'bluebird'
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

    it('should accept a JSX element as a value', () => {
      const submitText = 'Click me to submit this form'
      const submitElement = <span>{submitText}</span>

      const component = mount(
        <Provider>
          <Form schema={schema} submitButtonText={submitElement} />
        </Provider>
      )

      expect(component.find('button').text()).toEqual(submitText)

      component.unmount()
    })
  })

  describe('submitButtonProps property', () => {
    it('should set submit button props', () => {
      const submitButtonProps = {
        className: 'custom-button-class'
      }

      const component = mount(
        <Provider>
          <Form schema={schema} submitButtonProps={submitButtonProps} />
        </Provider>
      )

      expect(component.find('button').hasClass(submitButtonProps.className)).toEqual(true)

      component.unmount()
    })
  })

  describe('onFormSubmit property', () => {
    it('should be called when the submit button is clicked', () => {
      const value = 'Squirtle'
      const callback = sinon.spy()
      const component = mount(
        <Provider>
          <Form schema={schema} onFormSubmit={callback} />
        </Provider>
      )

      const input = component.find('input')
      input.simulate('change', { target: { value } })
      component.update()

      return Promise.delay(150).then(() => {
        component.find('form').simulate('submit')
        expect(callback.callCount).toEqual(1)
        expect(callback.getCall(0).args[0].formData).toEqual({ Name: value })
      })
    })
  })

  describe('onFormChange property', () => {
    it('should be called when an input field is changed', () => {
      const value = 'Squirtle'
      const callback = sinon.spy()
      const component = mount(
        <Provider>
          <Form schema={schema} onFormChange={callback} />
        </Provider>
      )

      const input = component.find('input')
      input.simulate('change', { target: { value } })
      component.update()

      return Promise.delay(150).then(() => {
        expect(callback.callCount).toEqual(1)
        expect(callback.getCall(0).args[0].formData).toEqual({ Name: value })
      })
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
