import * as semver from 'resin-semver'
import React from 'react'
import Input from '../Input'
import isString from 'lodash/isString'

/**
 * See the node-semver docs for more information on semver ranges
 * https://github.com/npm/node-semver#ranges
 */
export const rules = {
  contains: (target, value) => semver.satisfies(value, target),
  'does not contain': (target, value) => !semver.satisfies(value, target)
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
