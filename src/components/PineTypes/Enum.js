import * as React from 'react'
import Select from '../Select'
import * as isString from 'lodash/isString'
import * as map from 'lodash/map'

export const Edit = ({ schema, value, onChange, ...props }) => (
  <Select {...props} value={value} onChange={e => onChange(e.target.value)}>
    {map(schema.values, item => {
      if (isString(item)) {
        return <option key={item}>{item}</option>
      } else {
        return (
          <option key={item} value={item.value}>
            {item.label}
          </option>
        )
      }
    })}
  </Select>
)

export const rules = {
  is: (target, value) => target === value,
  'is not': (target, value) => target !== value
}

export const normalize = value => value

export const validate = value => !!value

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{data}</span>
  </div>
)
