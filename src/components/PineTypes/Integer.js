import * as React from 'react'
import * as isInteger from 'lodash/isInteger'
import Input from '../Input'

const p10 = val => parseInt(val, 10)

export const rules = {
  equals: (target, value) => p10(target) === p10(value),
  'more than': (target, value) => p10(target) > p10(value),
  'less than': (target, value) => p10(target) < p10(value)
}

export const validate = isInteger

export const Edit = ({ value, onChange, ...props }) => (
  <Input
    {...props}
    type='number'
    value={value}
    onChange={e => onChange(p10(e.target.value))}
  />
)

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{p10(data)}</span>
  </div>
)
