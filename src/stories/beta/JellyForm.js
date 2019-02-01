import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Async } from '../../unstable/'

const JellyForm = Async(() => {
  return import("../../unstable/components/JellyForm");
});

const schema = `
  title: pricing
  version: 1
  properties:
    - devices:
        title: Devices
        type: number
        default: 1000
    - months:
        title: Commitment (months)
        default: 12
        type: number
    - yearDiscount:
        title: Year Discount
        default: 0
        type: number
    - stepdownFactor:
        title: Stepdown Factor
        default: 0.9
        type: number
    - classMultiplier:
        title: Device Class
        type: string?
        default: 1
        enum:
          - title: basic
            value: 0.9
          - title: standard
            value: 1
          - title: gateway
            value: 1.1
    - licenseMultiplier:
        title: License Type
        type: string
        default: 1
        enum:
          - title: Transferrable
            value: 1
          - title: Fixed
            value: 0.8
    - microservices:
        type: number
        default: 0
        enum:
          - title: Yes
            value: 1
          - title: No
            value: 0
    - microservices_boost:
        title: Multicontainer Boost
        type: number
        default: 0.5
    - unit:
        title: Base unit price
        type: number
        default: 1
    - Result:
        properties:
          - Total:
              formula: >
                devices * months * unit *
                  (1 - (((months > 11 ? 13 : 0) + (months-1))/24) * yearDiscount) *
                  POW(stepdownFactor, LOG10(MAX((devices * months) / 1000, 1))) *
                  licenseMultiplier *
                  classMultiplier *
                  (1 + microservices_boost * microservices)
              readOnly: true
              type: number
          - devpm:
              title: Per dev/mo
              formula: >
                unit *
                  (1 - (((months > 11 ? 13 : 0) + (months-1))/24) * yearDiscount) *
                  POW(stepdownFactor, LOG10(MAX((devices * months) / 1000, 1))) *
                  licenseMultiplier *
                  classMultiplier *
                  (1 + microservices_boost * microservices)
              readOnly: true
              type: number
          - marginalDevice:
              title: Marginal Device
              formula: >
                ((devices * months * unit *
                  (1 - (((months > 11 ? 13 : 0) + (months-1))/24) * yearDiscount) *
                  POW(stepdownFactor, LOG10(MAX((devices * months) / 1000, 1))) *
                  licenseMultiplier *
                  classMultiplier *
                  (1 + microservices_boost * microservices))
                   -
                  ((devices-1) * months * unit *
                  (1 - (((months > 11 ? 13 : 0) + (months-1))/24) * yearDiscount) *
                  POW(stepdownFactor, LOG10(MAX((devices * months) / 1000, 1))) *
                  licenseMultiplier *
                  classMultiplier *
                  (1 + microservices_boost * microservices))) / months
              readOnly: true
              type: number

`

storiesOf('Beta/JellyForm', module)
  .add('Standard', () => {
    return (
      <JellyForm schema={schema} />
    )
  })

