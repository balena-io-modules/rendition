/* globals expect, test */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, Map } from '../../../dist'
import { API_KEY } from './config'

test('Map renders correctly', () => {
  const component = renderer.create(
    <Provider>
      <Map
        data={[
          {
            id: 1,
            lat: 51.507,
            lng: 0.127,
            title: 'London'
          }
        ]}
        dataMap={{
          lat: 'lat',
          lng: 'lng',
          id: 'id',
          title: 'title'
        }}
        apiKey={API_KEY}
      />
    </Provider>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
