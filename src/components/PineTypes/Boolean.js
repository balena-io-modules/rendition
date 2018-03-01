import * as React from 'react'
import Select from '../Select'
const isBoolean = require('lodash/isBoolean')
const isString = require('lodash/isString')

export const Edit = ({ value, onChange, ...props }) => (
  <Select
    {...props}
    value={value ? 'true' : 'false'}
    onChange={e => onChange(e.target.value === 'true')}
    >
    <option>true</option>
    <option>false</option>
  </Select>
)

export const rules = {
  'is true': target => !!target,
  'is false': target => !target
}

export const validate = isBoolean

export const normalize = value => {
  if (isString(value)) {
    switch (value.toLowerCase()) {
    case 'true':
    case 'yes':
    case '1':
      return true
    case 'false':
    case 'no':
    case '0':
      return false
    default:
      return !!value
    }
  }

  return !!value
}

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{data ? 'true' : 'false'}</span>
  </div>
)
