import React from 'react'
import Select from '../Select'
import _ from 'lodash'

export const Edit = ({ schema, value, onChange, ...props }) => (
  <Select {...props} value={value} onChange={e => onChange(e.target.value)}>
    {_.map(schema.values, item => {
      if (_.isString(item)) {
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

export const validate = _.isBoolean

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{data}</span>
  </div>
)
