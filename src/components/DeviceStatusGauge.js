import * as React from 'react'
import * as filter from 'lodash/filter'
import { withTheme } from 'styled-components'
import { compose } from 'recompose'
import * as ResinDeviceStatus from 'resin-device-status'
import Gauge from './Gauge'

import asRendition from '../asRendition'
import theme from '../theme'

const { colors } = theme

const pathFillColor = status => {
  if (status === 'idle') {
    return colors.statusIdle.main
  }

  if (status === 'configuring') {
    return colors.statusConfiguring.main
  }

  if (status === 'updating') {
    return colors.statusUpdating.main
  }

  if (status === 'post-provisioning') {
    return colors.statusPostProvisioning.main
  }

  if (status === 'offline') {
    return colors.statusOffline.main
  }
}

const DeviceStatusGauge = ({ devices, ...props }) => {
  const data = []
  const allDevices = devices || []

  ResinDeviceStatus.statuses.forEach(status => {
    const devices = filter(
      allDevices,
      d => ResinDeviceStatus.getStatus(d).key === status.key
    )

    data.push({
      key: status.key,
      name: status.name,
      value: devices.length,
      color: pathFillColor(status.key)
    })
  })

  return (
    <Gauge
      data={data}
      title='Total Devices'
      placeholderColor={colors.statusOffline.main}
    />
  )
}

export default compose(withTheme, asRendition)(DeviceStatusGauge)
