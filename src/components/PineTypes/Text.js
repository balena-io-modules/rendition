import RegexParser from 'regex-parser'
import React from 'react'
import Textarea from '../Textarea'
import showdown from 'showdown'
import isString from 'lodash/isString'

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
