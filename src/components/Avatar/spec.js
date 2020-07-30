/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { Avatar, Provider } from '../../../dist'

describe('Avatar component', () => {
  it('Avatar renders correctly', () => {
    const component = renderer.create(
      <Provider>
        <Avatar />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('firstName and lastName properties', () => {
    it('should render the Avatar with initials if src is not passed', () => {
      const component = mount(
        <Provider>
          <Avatar firstName='test' lastName='user' />
        </Provider>
      )
      expect(component.text()).toContain('TU')
    })
  })

  describe('null src, valid firstname and valid lastName properties', () => {
    it('should render the Avatar with initials if src is passed but it is null', () => {
      const component = mount(
        <Provider>
          <Avatar src={null} firstName='example' lastName='user' />
        </Provider>
      )
      expect(component.text()).toContain('EU')
    })
  })
})
