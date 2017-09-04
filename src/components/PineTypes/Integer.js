import _ from 'lodash'
import { h } from 'preact'
import Input from '../Input'

const p10 = val => parseInt(val, 10)

export const rules = {
  equals: (target, value) => p10(target) === p10(value),
  'more than': (target, value) => p10(target) > p10(value),
  'less than': (target, value) => p10(target) < p10(value)
}

export const validate = _.isInteger

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
