/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import ArcSlider from '../../src/components/ArcSlider'

describe('ArcSlider component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <ArcSlider />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
