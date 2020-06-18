import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Map } from '../../'
import Readme from './README.md'
import { API_KEY } from './config'

storiesOf('Next/Map', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3} height='600px'>
        <Map
          m={2}
          data={[
            {
              id: 1,
              lat: 51.507,
              lng: 0.127,
              title: 'London'
            },
            {
              id: 2,
              lat: 52.366,
              lng: 4.89,
              title: 'Amsterdam'
            }
          ]}
          dataMap={{
            lat: (entry) => entry.lat,
            lng: 'lng',
            id: 'id',
            title: 'title'
          }}
          apiKey={API_KEY}
        />
      </Box>
    )
  })
