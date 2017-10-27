import * as semver from 'resin-semver'
import * as React from 'react'
import * as isString from 'lodash/isString'
import Input from '../Input'

export const rules = {
  is: (target, value) => target && semver.compare(target, value) === 0,
  'is greater than': (target, value) => target && semver.gt(target, value),
  'is less than': (target, value) => target && semver.lt(target, value)
}

export const validate = isString

export const Edit = ({ value, onChange, ...props }) => (
  <Input
    {...props}
    type='text'
    value={value}
    onChange={e => onChange(e.target.value)}
  />
)

export const Display = ({ data, ...props }) => (
  <div {...props} className='markdown-body'>
    <code>{data}</code>
  </div>
)
