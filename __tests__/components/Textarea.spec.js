/* globals expect, describe, it */
import { mount } from 'enzyme'
import noop from 'lodash/noop'
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import Textarea from '../../src/components/Textarea'

describe('Textarea component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Textarea />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should accept and display a value', () => {
    const value = 'lorem ipsum dolor sit amet'

    const component = mount(
      <Provider>
        <Textarea value={value} onChange={noop} />
      </Provider>
    )

    expect(component.text()).toEqual(value)
  })

  describe('autoRows property', () => {
    const lines = [
      'lorem ipsum dolor sit amet',
      'consectetur adipiscing elit',
      'mauris dui nulla',
      'volutpat et commodo eu',
      'pellentesque a risus',
      'vivamus iaculis consectetur nulla vel laoreet'
    ]

    const value = lines.join('\n')

    it('should resize the textarea to match the content', () => {
      const component = mount(
        <Textarea autoRows value={value} onChange={noop} />
      )

      // Sanity check to make sure autoRows doesn't change the default behaviour
      expect(component.text()).toEqual(value)

      const rows = component.find('textarea').prop('rows')

      expect(rows).toEqual(lines.length)

      const newLines = lines.slice()
      newLines.push('duis fermentum cursus accumsan')
      const newValue = newLines.join('\n')

      component.setProps({ value: newValue })
      component.update()

      expect(component.text()).toEqual(newValue)

      const newRows = component.find('textarea').prop('rows')

      expect(newRows).toEqual(newLines.length)
    })

    it('should respect the maxRows property', () => {
      const maxRows = Math.ceil(lines.length / 2)
      const component = mount(
        <Provider>
          <Textarea
            autoRows
            maxRows={maxRows}
            value={value}
            onChange={noop}
          />
        </Provider>
      )

      // Sanity check to make sure autoRows doesn't change the default behaviour
      expect(component.text()).toEqual(value)

      const rows = component.find('textarea').prop('rows')

      expect(rows).toEqual(maxRows)
    })

    it('should respect the minRows property', () => {
      const minRows = lines.length * 2
      const component = mount(
        <Provider>
          <Textarea
            autoRows
            minRows={minRows}
            value={value}
            onChange={noop}
          />
        </Provider>
      )

      // Sanity check to make sure autoRows doesn't change the default behaviour
      expect(component.text()).toEqual(value)

      const rows = component.find('textarea').prop('rows')

      expect(rows).toEqual(minRows)
    })
  })

  describe('maxRows property', () => {
    it('should not allow a row property larger than maxRows', () => {
      const maxRows = 4
      const rows = maxRows * 2
      const component = mount(
        <Provider>
          <Textarea
            rows={rows}
            maxRows={maxRows}
          />
        </Provider>
      )

      const realRows = component.find('textarea').prop('rows')

      expect(realRows).toEqual(maxRows)
    })
  })

  describe('minRows property', () => {
    it('should not allow a row property smaller than minRows', () => {
      const minRows = 8
      const rows = Math.ceil(minRows / 2)
      const component = mount(
        <Provider>
          <Textarea
            rows={rows}
            minRows={minRows}
          />
        </Provider>
      )

      const realRows = component.find('textarea').prop('rows')

      expect(realRows).toEqual(minRows)
    })
  })
})
