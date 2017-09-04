import { h } from 'preact'
import Select from '../Select'
import _ from 'lodash'

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

export const validate = _.isBoolean

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{data ? 'true' : 'false'}</span>
  </div>
)
