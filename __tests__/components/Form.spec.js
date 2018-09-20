/* globals expect, describe, it */
import Promise from 'bluebird'
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import sinon from 'sinon'
import Alert from '../../src/components/Alert'
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

  it('should still render if an unknown format is used', () => {
    const uuidSchema = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      }
    }

    mount(
      <Provider>
        <Form schema={uuidSchema} />
      </Provider>
    )
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

  describe('array fields', () => {
    const arraySchema = {
      type: 'object',
      properties: {
        Array: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }

    const callback = sinon.spy()
    const component = mount(
      <Provider>
        <Form
          schema={arraySchema}
          onFormChange={callback}
        />
      </Provider>
    )

    const value1 = 'foobarbaz'
    const value2 = 'bazbarfoo'

    it('should be able to add an item', () => {
      const value = 'foobarbaz'

      component.find('.rendition-form-array-item__add-item')
        .first()
        .simulate('click')

      const input = component.find('input').first()

      input.simulate('change', {
        target: {
          value: value1
        }
      })

      component.update()

      return Promise.delay(150).then(() => {
        const callArg = callback.lastCall.args[0]
        expect(callArg.formData).toEqual({
          Array: [ value ]
        })
      })
    })

    it('should be able to add multiple items', () => {
      component.find('.rendition-form-array-item__add-item')
        .first()
        .simulate('click')

      const input = component.find('input').last()

      input.simulate('change', {
        target: {
          value: value2
        }
      })

      component.update()

      return Promise.delay(150).then(() => {
        const callArg = callback.lastCall.args[0]
        expect(callArg.formData).toEqual({
          Array: [ value1, value2 ]
        })
      })
    })

    it('should be able to move an item up', () => {
      component.find('.rendition-form-array-item__move-up')
        .last()
        .simulate('click')

      component.update()

      return Promise.delay(150).then(() => {
        const callArg = callback.lastCall.args[0]
        expect(callArg.formData).toEqual({
          Array: [ value2, value1 ]
        })
      })
    })

    it('should be able to move an item down', () => {
      component.find('.rendition-form-array-item__move-down')
        .first()
        .simulate('click')

      component.update()

      return Promise.delay(150).then(() => {
        const callArg = callback.lastCall.args[0]
        expect(callArg.formData).toEqual({
          Array: [ value1, value2 ]
        })
      })
    })

    it('should be able to remove an item', () => {
      component.find('.rendition-form-array-item__remove-item')
        .last()
        .simulate('click')

      component.update()

      return Promise.delay(150).then(() => {
        const callArg = callback.lastCall.args[0]
        expect(callArg.formData).toEqual({
          Array: [ value1 ]
        })
      })
    })
  })

  describe('uiSchema property', () => {
    const uiSchema = {
      Name: {
        'ui:warning': 'lorem ipsum dolor sit amet'
      }
    }

    const component = mount(
      <Provider>
        <Form
          uiSchema={uiSchema}
          schema={schema}
        />
      </Provider>
    )

    it('should be able to add warnings using ui:warning', () => {
      const warnings = component.find(Alert)

      expect(warnings.length).toEqual(1)

      expect(warnings.first().text()).toEqual(uiSchema.Name['ui:warning'])
    })
  })
})
