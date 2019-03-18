import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { DeviceStatusGauge, Provider } from '../../'
import { isTakingScreenshot } from '../helpers'

const mockDeviceArray = [
  {
    is_online: true
  },
  {
    provisioning_state: 'Post-Provisioning'
  },
  {
    is_online: false,
    last_connectivity_event: null
  },
  {
    is_online: false,
    last_connectivity_event: 1503662108854
  },
  {
    is_online: true,
    last_connectivity_event: 1503662108854,
    status: 'Starting'
  },
  {
    is_online: true,
    last_connectivity_event: 1503662108854,
    status: 'Configuring'
  },
  {
    is_online: true,
    last_connectivity_event: 1503662108854,
    status: 'idle'
  },
  {
    download_progress: 5,
    is_online: true,
    last_seen_time: 1503662108854,
    status: 'Downloading'
  }
]

storiesOf('Deprecated/DeviceStatusGauge', module)
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <DeviceStatusGauge
          disableAnimation={true || isTakingScreenshot}
          m={30}
          devices={mockDeviceArray}
        />
      </Provider>
    )
  })
