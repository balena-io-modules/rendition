import React from 'react'
import { storiesOf } from '@storybook/react'
import DeviceStatusGauge from '../components/DeviceStatusGauge'

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

storiesOf('DeviceStatusGauge', module).addWithInfo('default', () => {
  return <DeviceStatusGauge m={30} devices={mockDeviceArray} />
})
