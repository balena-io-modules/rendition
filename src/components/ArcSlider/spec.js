/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import { ArcSlider, Provider } from '../../../dist'

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
