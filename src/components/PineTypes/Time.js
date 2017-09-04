import moment from 'moment'
import { h } from 'preact'
import Input from '../Input'

/**
  Time types compare the time section only and ignore date.
  Time types use momentjs for comparison, so the input and target value
  should be in one of the following forms:
  - ISO 8601
  - Unix timestamp (seconds or milliseconds)
  - JS Date object
  See https://momentjs.com/docs/#/parsing/ for more information
*/
const EPOCH_PREFIX = 'Thu, 01 Jan 1970'
const timeOfDay = val =>
  moment(`${EPOCH_PREFIX} ${moment(val).format('HH:mm:ss:SS')}`)

export const rules = {
  is: (target, value) => target && timeOfDay(target).isSame(timeOfDay(value)),
  'is before': (target, value) =>
    target && timeOfDay(target).isBefore(timeOfDay(value)),
  'is after': (target, value) =>
    target && timeOfDay(target).isAfter(timeOfDay(value))
}

export const validate = value => moment(`${EPOCH_PREFIX} ${value}`).isValid()

export const Edit = ({ value, onChange, ...props }) => (
  <Input
    {...props}
    type='time'
    value={value}
    onChange={e => onChange(e.target.value)}
  />
)

export const Display = ({ data, ...props }) => (
  <div {...props}>
    <span>{moment(`${EPOCH_PREFIX} ${data}`).format('h:mm:ss a')}</span>
  </div>
)
