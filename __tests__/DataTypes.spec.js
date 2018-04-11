/* globals expect, describe, it */
import { JSDOM } from 'jsdom'
import { getDataModel } from '../src/components/DataTypes'
global.document = (new JSDOM('')).window.document

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

      expect(getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for date-time formatted string types', () => {
      const schema = {
        type: 'string',
        format: 'date-time'
      }

      expect(getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for object types', () => {
      const schema = {
        type: 'object'
      }

      expect(getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for boolean types', () => {
      const schema = {
        type: 'boolean'
      }

      expect(getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for number types', () => {
      const schema = {
        type: 'number'
      }

      expect(getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })
  })
})
