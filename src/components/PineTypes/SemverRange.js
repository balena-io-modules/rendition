import * as semver from 'resin-semver'
import * as React from 'react'
import * as isString from 'lodash/isString'
import Input from '../Input'

/**
 * See the node-semver docs for more information on semver ranges
 * https://github.com/npm/node-semver#ranges
 */
export const rules = {
  contains: (target, value) => semver.satisfies(value, target),
  'does not contain': (target, value) => !semver.satisfies(value, target)
}

export const validate = isString

export const normalize = value => (value == null ? '' : value.toString())

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
