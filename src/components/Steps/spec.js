/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, Steps, Step } from '../../../dist'

describe('Steps component', () => {
  it('should match the stored snapshot', () => {
    const component = renderer.create(
      <Provider>
        <Steps m={3} titleText={'Beginners Guide'} onClose={() => null}>
          <Step status='pending' onClick={() => null}>
            Do this
          </Step>
          <Step status='completed' onClick={() => null}>
            And then this
          </Step>
          <Step status='pending' onClick={() => null}>
            And finally this
          </Step>
        </Steps>
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
