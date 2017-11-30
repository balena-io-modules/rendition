import * as moment from 'moment'
import * as React from 'react'
import Input from '../Input'

/**
  Date compares the day as the lowest level of granularity.
  Date types use momentjs for comparison, so the input and target value
  should be in one of the following forms:
  - ISO 8601
  - Unix timestamp (seconds or milliseconds)
  - JS Date object
  See https://momentjs.com/docs/#/parsing/ for more information
*/
export const startOfDay = val => moment(val).startOf('day')

export const rules = {
  is: (target, value) => target && startOfDay(target).isSame(startOfDay(value)),
  'is before': (target, value) =>
    target && startOfDay(target).isBefore(startOfDay(value)),
  'is after': (target, value) =>
    target && startOfDay(target).isAfter(startOfDay(value))
}

export const validate = value => moment(value).isValid()

// Since we interpret dates on display, there is no need to normalize here
export const normalize = value => value

export const Edit = ({ value, onChange, ...props }) => (
  <Input
    {...props}
    type='date'
    value={value}
    onChange={e => onChange(e.target.value)}
  />
)

export const Display = ({
  data,
  dateFormat = 'dddd, MMMM Do YYYY',
  ...props
}) => (
  <div {...props}>
    <span>{moment(data).format(dateFormat)}</span>
  </div>
)
