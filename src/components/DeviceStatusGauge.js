import { h } from 'preact'
import _ from 'lodash'
import Pie from 'paths-js/pie'
import styled, { withTheme } from 'styled-components'
import { compose } from 'recompose'
import ResinDeviceStatus from 'resin-device-status'

import hoc from '../hoc'
import theme from '../theme'

const { colors, font } = theme

const DeviceStatusGaugeWrapper = styled.div`
  display: block;
  color: ${({ theme }) => theme.colors.text.main};

  /* fix edge hover missplacing bug
    on svg text inside anchors
  */
  &,
  &:hover {
    text-decoration: none;

    text {
      text-decoration: none !important;
    }

    .device-status-gauge__graph__total-devices-label,
    .device-status-gauge__graph__total-devices-number {
      transform: translateX(0);
    }
  }

  .device-status-gauge__graph {
    display: block;
    width: 100%;
    max-width: 180px;
    margin: 0 auto 10px;
  }

  .device-status-gauge__graph__total-devices-label {
    font-family: ${font};
    font-size: 5px;
    fill: #b8b8b8;
    text-anchor: middle;
  }

  .device-status-gauge__graph__total-devices-number {
    font-family: ${font};
    font-size: 26px;
    fill: #5e5e5e;
    letter-spacing: -1px;
    text-anchor: middle;
  }

  .device-status-gauge__statuses {
    .clearfix;
    list-style: none;
    padding: 5px;
    margin: 0 auto;
    background: white;
    border-radius: 5px;
    max-width: 240px;
    border: 1px solid #ececec;
    overflow: hidden;
  }

  .device-status-gauge__status {
    display: flex;
    padding: 3px 0 3px 2px;
    line-height: 9px;
    width: 50%;
    float: left;
  }

  .device-status-gauge__status--post-provisioning {
    width: 100%;
  }

  .device-status-gauge__status__color {
    display: inline-block;
    flex: 0 0 auto;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }

  .device-status-gauge__status__name {
    font-size: 11px;
  }
  .block-status-idle {
    background-color: ${colors.statusIdle.main};
  }
  .block-status-configuring {
    background-color: ${colors.statusConfiguring.main};
  }
  .block-status-updating {
    background-color: ${colors.statusUpdating.main};
  }
  .block-status-post-provisioning {
    background-color: ${colors.statusPostProvisioning.main};
  }
  .block-status-offline {
    background-color: ${colors.statusOffline.main};
  }
`

const getDefaultPlaceholderState = () => ({
  count: 0,
  key: ResinDeviceStatus.status.OFFLINE,
  name: _.get(
    ResinDeviceStatus.statuses.find(
      s => s.key === ResinDeviceStatus.status.OFFLINE
    ),
    'name',
    'Offline'
  ),
  value: 1
})

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
  const statuses = ResinDeviceStatus.statuses

  ResinDeviceStatus.statuses.forEach(status => {
    const devices = _.filter(
      allDevices,
      d => ResinDeviceStatus.getStatus(d).key === status.key
    )

    if (devices.length) {
      data.push({
        count: devices.length,
        key: status.key,
        name: status.name,
        value: devices.length
      })
    }
  })

  const placeholderState =
    data.length === 1 ? data[0] : getDefaultPlaceholderState()

  const graph = Pie({
    accessor: item => item.value,
    center: [0, 0],
    data: data,
    R: 46,
    r: 25
  })

  const gauge = graph.curves
  const totalDevices = allDevices.length
  return (
    <DeviceStatusGaugeWrapper {...props}>
      <svg
        class='device-status-gauge__graph'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          fill=' white'
          stroke='#dadada'
          stroke-width='5'
          cx='50'
          cy='50'
          r='46'
        />

        <g>
          <circle
            fill={pathFillColor(placeholderState.key)}
            cx='50'
            cy='50'
            r='46'
          />
          <circle fill='white' cx='50' cy='50' r='25' />
          <title ng-if='placeholderState.count'>
            {placeholderState.name}: devices
          </title>
        </g>

        <g transform='translate(50, 50)'>
          {_.map(gauge, segment => {
            return (
              <g>
                {!!segment.item.count && (
                  <title>{segment.item.name}: devices</title>
                )}
                <path
                  fill={pathFillColor(segment.item.key)}
                  d={segment.sector.path.print()}
                />
              </g>
            )
          })}
        </g>
        <text
          class='device-status-gauge__graph__total-devices-label'
          x='50'
          y='41'
        >
          TOTAL DEVICES
        </text>
        <text
          class='device-status-gauge__graph__total-devices-number'
          x='50'
          y='63'
        >
          {totalDevices}
        </text>
      </svg>

      <ul class='device-status-gauge__statuses'>
        {_.map(statuses, status => {
          return (
            <li
              className={`col-xs-6 device-status-gauge__status device-status-gauge__status--${status.key}`}
            >
              <span
                className={`device-status-gauge__status__color block-status-${status.key}`}
              >
                &nbsp;
              </span>
              <span class='device-status-gauge__status__name'>
                {status.name}
              </span>
            </li>
          )
        })}
      </ul>
    </DeviceStatusGaugeWrapper>
  )
}

export default compose(withTheme, hoc)(DeviceStatusGauge)
