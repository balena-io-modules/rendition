import * as RegexParser from 'regex-parser'
import * as React from 'react'
import Textarea from '../Textarea'
import * as showdown from 'showdown'
import * as isString from 'lodash/isString'

const converter = new showdown.Converter()

const normalizeString = string => {
  return string || ''
}

export const rules = {
  is: (target, value) => normalizeString(target) === value,
  contains: (target, value) => normalizeString(target).includes(value),
  'does not contain': (target, value) =>
    !normalizeString(target).includes(value),
  'matches RegEx': (target, value) =>
    normalizeString(target).match(RegexParser(value)),
  'does not match RegEx': (target, value) =>
    !normalizeString(target).match(RegexParser(value))
}

export const validate = isString

export const normalize = value => (value == null ? '' : value.toString())

export const Edit = ({ onChange, ...props }) => (
  <Textarea onChange={e => onChange(e.target.value)} {...props} />
)

export const Display = ({ data, ...props }) => (
  <div
    {...props}
    className='markdown-body'
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(data) }}
  />
)
