const RegexParser = require('regex-parser')
const isString = require('lodash/isString')
import * as React from 'react'
import Input from '../Input'
import * as showdown from 'showdown'

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

export const validate = val => isString(val) && val.length <= 255

export const normalize = value => (value == null ? '' : value.toString())

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
