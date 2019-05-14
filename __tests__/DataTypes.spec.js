/* globals expect, describe, it */
import { getDataModel } from '../dist/components/DataTypes'
import { normalizeDateTime } from '../dist/components/DataTypes/date-time-helpers'

const expectMatchesKeys = (data, keys) =>
  expect(Object.keys(data).sort()).toEqual(keys.sort())

describe('DataTypes', () => {
  describe('.getDataModel()', () => {
    const dataModelKeys = [
      'Edit',
      'operators',
      'createFilter',
      'decodeFilter'
    ]

    it('should return null if provided with a falsey value as the schema parameter', () => {
      expect(getDataModel()).toBe(null)
      expect(getDataModel(0)).toBe(null)
      expect(getDataModel(false)).toBe(null)
      expect(getDataModel(null)).toBe(null)
      expect(getDataModel('')).toBe(null)
    })

    it('should return null for unknown types', () => {
      const schema = {
        type: 'foobar'
      }

      expect(getDataModel(schema)).toBe(null)
    })

    it('should return a model for string types', () => {
      const schema = {
        type: 'string'
      }

      expectMatchesKeys(getDataModel(schema), dataModelKeys)
    })

    it('should return a model for date-time formatted string types', () => {
      const schema = {
        type: 'string',
        format: 'date-time'
      }

      expectMatchesKeys(getDataModel(schema), dataModelKeys)
    })

    it('should return a model for object types', () => {
      const schema = {
        type: 'object'
      }

      expectMatchesKeys(getDataModel(schema), dataModelKeys)
    })

    it('should return a model for boolean types', () => {
      const schema = {
        type: 'boolean'
      }

      expectMatchesKeys(getDataModel(schema), dataModelKeys)
    })

    it('should return a model for number types', () => {
      const schema = {
        type: 'number'
      }
      expectMatchesKeys(getDataModel(schema), dataModelKeys)
    })
  })

  describe('normalizeDateTime', () => {
    it('rejects invalid date', () => {
      expect(normalizeDateTime('wrong time')).toEqual('Invalid date')
      expect(normalizeDateTime('')).toEqual('Invalid date')
    })

    it('formats the date correctly', () => {
      expect(normalizeDateTime('2017-01-01T08:49:26Z')).toEqual('2017-01-01T08:49:26Z')
      // This case will fail, if you are in a different TZ than UTC
      // Set a TZ when running tests: $ TZ='Etc/UTC' npm test
      expect(normalizeDateTime('2018-03-26T11:43')).toEqual('2018-03-26T11:43:00Z')
      expect(normalizeDateTime('Sun, 01 Jan 2017 08:49:26 +0000')).toEqual('2017-01-01T08:49:26Z')
    })
  })
})
