import * as React from 'react'
import * as RegexParser from 'regex-parser'
import * as isArray from 'lodash/isArray'
import * as assign from 'lodash/assign'
import * as some from 'lodash/some'
import * as includes from 'lodash/includes'
import * as isString from 'lodash/isString'
import * as values from 'lodash/values'
import * as keys from 'lodash/keys'
import Input from '../Input'
import { Flex } from '../Grid'

const normalizeToCollection = value => (isArray(value) ? value : [value])

export const rules = {
  is: (target, value) => {
    return some(normalizeToCollection(target), value)
  },
  'is not': (target, value) => {
    return !some(normalizeToCollection(target), value)
  },
  'key is': {
    getLabel: schema => schema.keyLabel && `${schema.keyLabel} is`,
    test: (target, value) => {
      return some(normalizeToCollection(target), value)
    }
  },
  'key contains': {
    getLabel: schema => schema.keyLabel && `${schema.keyLabel} contains`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return some(
        normalizeToCollection(target),
        item => item && item[lookupKey] && item[lookupKey].includes(lookupValue)
      )
    }
  },
  'key does not contain': {
    getLabel: schema =>
      schema.keyLabel && `${schema.keyLabel} does not contain`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return !some(
        normalizeToCollection(target),
        item => item && item[lookupKey] && item[lookupKey].includes(lookupValue)
      )
    }
  },
  'key matches RegEx': {
    getLabel: schema => schema.keyLabel && `${schema.keyLabel} matches RegEx`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return some(
        normalizeToCollection(target),
        item =>
          item &&
          item[lookupKey] &&
          item[lookupKey].match(RegexParser(lookupValue))
      )
    }
  },
  'key does not match RegEx': {
    getLabel: schema =>
      schema.keyLabel && `${schema.keyLabel} does not match RegEx`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return !some(
        normalizeToCollection(target),
        item =>
          item &&
          item[lookupKey] &&
          item[lookupKey].match(RegexParser(lookupValue))
      )
    }
  },
  'value is': {
    getLabel: schema => schema.valueLabel && `${schema.valueLabel} is`,
    test: (target, value) => {
      return some(normalizeToCollection(target), value)
    }
  },
  'value contains': {
    getLabel: schema => schema.valueLabel && `${schema.valueLabel} contains`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return some(
        normalizeToCollection(target),
        item => item && item[lookupKey] && item[lookupKey].includes(lookupValue)
      )
    }
  },
  'value does not contain': {
    getLabel: schema =>
      schema.valueLabel && `${schema.valueLabel} does not contain`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return !some(
        normalizeToCollection(target),
        item => item && item[lookupKey] && item[lookupKey].includes(lookupValue)
      )
    }
  },
  'value matches RegEx': {
    getLabel: schema =>
      schema.valueLabel && `${schema.valueLabel} matches RegEx`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return some(
        normalizeToCollection(target),
        item =>
          item &&
          item[lookupKey] &&
          item[lookupKey].match(RegexParser(lookupValue))
      )
    }
  },
  'value does not match RegEx': {
    getLabel: schema =>
      schema.valueLabel && `${schema.valueLabel} does not match RegEx`,
    test: (target, value) => {
      const lookupKey = keys(value).pop()
      const lookupValue = values(value).pop()
      return !some(normalizeToCollection(target), item => {
        return (
          item &&
          item[lookupKey] &&
          item[lookupKey].match(RegexParser(lookupValue))
        )
      })
    }
  }
}

export const validate = value => true

export const normalize = value => value

const keyOperators = [
  'is',
  'is not',
  'key is',
  'key contains',
  'key does not contain',
  'key matches RegEx',
  'key does not match RegEx'
]

const valueOperators = [
  'is',
  'is not',
  'value is',
  'value contains',
  'value does not contain',
  'value matches RegEx',
  'value does not match RegEx'
]

export const Edit = props => {
  const { schema, onChange, operator } = props
  let { value } = props

  // Convert strings to objects
  if (isString(value)) {
    let p = {}
    if (includes(valueOperators, operator)) {
      p[schema.value] = value
    }
    if (includes(keyOperators, operator)) {
      p[schema.key] = value
    }

    value = p
  }

  return (
    <Flex wrap>
      {includes(keyOperators, operator) && (
        <Input
          type='text'
          value={value ? value[schema.key] : ''}
          mr={2}
          mb={1}
          placeholder={schema.keyLabel || 'Key'}
          onChange={e =>
            onChange(assign(value, { [schema.key]: e.target.value }))
          }
        />
      )}
      {includes(valueOperators, operator) && (
        <Input
          type='text'
          value={value ? value[schema.value] : ''}
          placeholder={schema.valueLabel || 'Value'}
          onChange={e =>
            onChange(assign(value, { [schema.value]: e.target.value }))
          }
        />
      )}
    </Flex>
  )
}

export const Display = ({ data, ...props }) => (
  <div {...props}>{JSON.stringify(data)}</div>
)
