/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import Provider from '../../src/components/Provider'
import DeviceStatusGauge from '../../src/components/DeviceStatusGauge'

test('DeviceStatusGauge renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <DeviceStatusGauge>DeviceStatusGauge</DeviceStatusGauge>
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
