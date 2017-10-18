import RegexParser from 'regex-parser'
import isString from 'lodash/isString'
import React from 'react'
import Textarea from '../Textarea'
import showdown from 'showdown'

export const converter = new showdown.Converter()

// We normalize falsey values to empty strings
export const toLowerCase = fn => (target, value) => {
  if (!target) {
    target = ''
  }
  return fn(target.toLowerCase(), value.toLowerCase())
}

export const rules = {
  is: toLowerCase((target, value) => target === value),
  contains: toLowerCase((target, value) => target.includes(value)),
  'does not contain': toLowerCase((target, value) => !target.includes(value)),
  'matches RegEx': toLowerCase((target, value) =>
    target.match(RegexParser(value))
  ),
  'does not match RegEx': toLowerCase(
    (target, value) => !target.match(RegexParser(value))
  )
}

export const validate = isString

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
