import * as RegexParser from 'regex-parser'
import * as isString from 'lodash/isString'
import * as React from 'react'
import Input from '../Input'
import * as showdown from 'showdown'

const converter = new showdown.Converter()

const normalize = string => {
  return string || ''
}

export const rules = {
  is: (target, value) => normalize(target) === value,
  contains: (target, value) => normalize(target).includes(value),
  'does not contain': (target, value) => !normalize(target).includes(value),
  'matches RegEx': (target, value) =>
    normalize(target).match(RegexParser(value)),
  'does not match RegEx': (target, value) =>
    !normalize(target).match(RegexParser(value))
}

export const validate = val => isString(val) && val.length <= 255

export const Edit = ({ onChange, ...props }) => (
  <Input type='text' onChange={e => onChange(e.target.value)} {...props} />
)

export const Display = ({ data, ...props }) => (
  <div
    {...props}
    className='markdown-body'
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(data) }}
  />
)
