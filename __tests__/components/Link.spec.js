/* globals expect, describe, it */
import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import {
  Link,
  Provider
} from '../../dist'

describe('Link component', () => {
  it('Should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Link>Link</Link>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Should display the href prop if a child is not provided', () => {
    const url = 'https://google.com'
    const component = mount(
      <Provider>
        <Link href={url} />
      </Provider>
    )

    expect(component.find(`a[href="${url}"]`).text()).toEqual(url)
  })
})
