/* globals expect, describe, it */
import * as _ from 'lodash'
import { JSDOM } from 'jsdom'
const Ajv = require('ajv')
const ajvKeywords = require('ajv-keywords')
const metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json')
global.document = (new JSDOM('')).window.document

import { SchemaSieve as sieve } from '../src'

// Small filter function to help with asserting function output
// This strips the '$id' key from filter schemas
const stripId = (filter) => {
  delete filter.$id
  filter.anyOf.forEach(subFilter => delete subFilter.$id)
  return filter
}

describe('SchemaSieve', () => {
  describe('.filter()', () => {
    it('should not throw if provided with an invalid data type in the filter', function () {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'Foo Bar'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        }
      ]

      const filter = sieve.createFilter(schema, [{
        field: 'test',
        operator: 'contains',
        value: 'abc'
      }])

      expect(() => sieve.filter(filter, collection)).not.toThrow()
    })

    it('should not throw if provided with an invalid operator in the filter', function () {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        }
      ]

      const filter = sieve.createFilter(schema, [{
        field: 'test',
        operator: 'foo bar',
        value: 'abc'
      }])

      expect(() => sieve.filter(filter, collection)).not.toThrow()
    })

    it('should not restrict results if there is an invalid data type in the schema', function () {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'Foo Bar'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        }
      ]

      const filter = sieve.createFilter(schema, [{
        field: 'test',
        operator: 'contains',
        value: 'abc'
      }])

      expect(sieve.filter(filter, collection)).toHaveLength(2)
    })

    it('should not restrict results if there is an invalid operator in the rule', function () {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        }
      ]

      const filter = sieve.createFilter(schema, [{
        field: 'test',
        operator: 'foo bar',
        value: 'abc'
      }])

      expect(sieve.filter(filter, collection)).toHaveLength(2)
    })

    it('should behave correctly when a filter references a non-existent schema field', function () {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        }
      ]

      const filter = sieve.createFilter(schema, [{
        // Set the input field to something that doesn't exist in the schema
        field: 'foo bar',
        operator: 'contains',
        value: 'abc'
      }])

      expect(sieve.filter(filter, collection)).toHaveLength(2)
    })

    describe('string types', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
      const collection = {
        'Entry 1': {
          test: 'abcde'
        },
        'Entry 2': {
          test: 'fghij'
        },
        'Entry 3': {
          test: 'KLmno'
        },
        'Entry 4': {
          test: 'ABCde'
        },
        'Entry 5': {
          test: null
        }
      }

      it('should correctly test values using the "is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'is',
          value: 'abcde'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "contains" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'contains',
          value: 'BCd'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 4'])
      })

      it('should correctly test values using the "does not contain" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'not_contains',
          value: 'ABC'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 2',
          'Entry 3',
          'Entry 5'
        ])
      })

      it('should correctly test values using the "matches RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'matches_re',
          value: 'ABC'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 4'])
      })

      it('should correctly test values using the "does not match RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'not_matches_re',
          value: 'ghi'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 3',
          'Entry 4',
          'Entry 5'
        ])
      })
    })

    describe('object types', () => {
      const schema = {
        type: 'object',
        properties: {
          Tag: {
            type: 'object',
            properties: {
              tag_name: {
                title: 'Name',
                description: 'key',
                type: 'string'
              },
              tag_value: {
                description: 'value',
                title: 'Value',
                type: 'string'
              }
            }
          }
        }
      }

      const collection = {
        'Entry 1': {
          Tag: [{
            tag_name: 'Aa',
            tag_value: '123'
          }]
        },
        'Entry 2': {
          Tag: [{
            tag_name: 'Bb',
            tag_value: '456'
          }]
        },
        'Entry 3': {
          Tag: [
            {
              tag_name: 'Cc',
              tag_value: '789'
            },
            {
              tag_name: 'Bb',
              tag_value: '101112'
            }
          ]
        },
        'Entry 4': {
          Tag: [{
            tag_name: 'Dd',
            tag_value: '131415'
          }]
        },
        'Entry 5': {
          foo: 'bar'
        }
      }

      it('should correctly test values using the "is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'is',
          value: {
            tag_name: 'Aa',
            tag_value: '123'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is not" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'is_not',
          value: {
            tag_name: 'Aa',
            tag_value: '123'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 3',
          'Entry 4',
          'Entry 5'
        ])
      })

      it('should correctly test values using the "key is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'key_is',
          value: {
            tag_name: 'Dd'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 4'])
      })

      it('should correctly test values using the "key contains" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'key_contains',
          value: {
            tag_name: 'b'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 3'
        ])
      })

      it('should correctly test values using the "key does not contain" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'key_not_contains',
          value: {
            tag_name: 'b'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 4',
          'Entry 5'
        ])
      })

      it('should correctly test values using the "key matches RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'key_matches_re',
          value: {
            tag_name: 'b'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 3'
        ])
      })

      it('should correctly test values using the "key does not match RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'key_not_matches_re',
          value: {
            tag_name: 'b'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 4',
          'Entry 5'
        ])
      })

      it('should correctly test values using the "value is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'value_is',
          value: {
            tag_value: '123'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "value contains" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'value_contains',
          value: {
            tag_value: '23'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "value does not contain" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'value_not_contains',
          value: {
            tag_value: '1'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 5'
        ])
      })

      it('should correctly test values using the "value matches RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'value_matches_re',
          value: {
            tag_value: '56'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 2'])
      })

      it('should correctly test values using the "value does not match RegEx" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'value_not_matches_re',
          value: {
            tag_value: '1'
          }
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 5'
        ])
      })
    })

    describe('date-time format string types', () => {
      const schema = {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date-time'
          }
        }
      }

      const collection = {
        'Entry 1': {
          date: '2017-01-01T08:49:26.961Z'
        },
        'Entry 2': {
          date: '2012-01-01T00:00:00.000Z'
        },
        'Entry 3': {
          date: null
        }
      }

      it('should correctly test values using the "is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'date',
          operator: 'is',
          value: '2017-01-01T08:49:26.961Z'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is" operator where the date is in a different format', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'date',
          operator: 'is',
          value: 'Sun, 01 Jan 2017 08:49:26 +0000'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is before" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'date',
          operator: 'is_before',
          value: '2016-12-25T00:00:00.000Z'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 2'])
      })

      it('should correctly test values using the "is after" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'date',
          operator: 'is_after',
          value: '2016-12-25T00:00:00.000Z'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })
    })

    describe('boolean types', () => {
      const schema = {
        type: 'object',
        properties: {
          bool: {
            type: 'boolean'
          }
        }
      }
      const collection = {
        'Entry 1': {
          bool: true
        },
        'Entry 2': {
          bool: false
        },
        'Entry 3': {
          bool: null
        }
      }

      it('should correctly test values using the "is" operator and the "true" value', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'bool',
          operator: 'is',
          value: true
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is false" operator and the "false" value', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'bool',
          operator: 'is',
          value: false
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 3'
        ])
      })
    })

    describe('number types', () => {
      const schema = {
        type: 'object',
        properties: {
          score: {
            type: 'number'
          }
        }
      }
      const collection = {
        'Entry 1': {
          score: 1.5
        },
        'Entry 2': {
          score: '2.3'
        },
        'Entry 3': {
          score: 3.19
        },
        'Entry 4': {
          score: null
        }
      }

      it('should correctly test values using the "is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'score',
          operator: 'is',
          value: 1.5
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is more than" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'score',
          operator: 'is_more_than',
          value: 2.3
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 2',
          'Entry 3'
        ])
      })

      it('should correctly test values using the "is less than" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'score',
          operator: 'is_less_than',
          value: 3.19
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 2'
        ])
      })
    })

    describe('enum types', () => {
      const schema = {
        type: 'object',
        properties: {
          category: {
            enum: [
              'Flame',
              'Lizard',
              'Seed'
            ]
          }
        }
      }
      const collection = {
        'Entry 1': {
          category: 'Flame'
        },
        'Entry 2': {
          category: 'Lizard'
        },
        'Entry 3': {
          category: 'Seed'
        },
        'Entry 4': {
          category: null
        }
      }

      it('should correctly test values using the "is" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'category',
          operator: 'is',
          value: 'Flame'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys(['Entry 1'])
      })

      it('should correctly test values using the "is not" operator', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'category',
          operator: 'is_not',
          value: 'Seed'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 2',
          'Entry 4'
        ])
      })
    })

    describe('Full text search', () => {
      const schema = {
        type: 'object',
        properties: {
          version: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          brief: {
            type: 'string'
          }
        }
      }

      const collection = {
        'Entry 1': {
          version: '1.5.0',
          description: 'Lorem ipsum',
          brief: 'dolor sit amet',
          incidents: 1
        },
        'Entry 2': {
          version: '1.7.0',
          description: 'consectetur adipiscing elit',
          brief: 'Nulla condimentum',
          incidents: 2
        },
        'Entry 3': {
          version: '2.0.0',
          description: 'eu mollis',
          brief: 'finibus lorem',
          incidents: 3
        }
      }

      it('should correctly test values', function () {
        const filter = sieve.createFullTextSearchFilter(schema, 'Lorem')

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 3'
        ])
      })
    })

    describe('Filtering an array', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
      const collection = [
        {
          test: 'abcde',
          id: 1
        },
        {
          test: 'fghij',
          id: 2
        },
        {
          test: 'KLmno',
          id: 3
        },
        {
          test: 'ABCde',
          id: 4
        }
      ]

      it('should return an array', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'contains',
          value: 'abc'
        }])

        const result = sieve.filter(filter, collection)
        expect(result).toBeArray()
      })

      it('should return the correct values', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'contains',
          value: 'abc'
        }])

        const result = sieve.filter(filter, collection)
        expect(result[0].test).toEqual(collection[0].test)
      })

      it('should allow an array of filters', function () {
        const filters = [
          sieve.createFilter(schema, [{
            field: 'test',
            operator: 'contains',
            value: 'de'
          }]),
          sieve.createFilter(schema, [{
            field: 'test',
            operator: 'contains',
            value: 'abc'
          }])
        ]

        const result = sieve.filter(filters, collection)
        expect(result[0].test).toEqual(collection[0].test)
      })
    })

    describe('Additional rules', () => {
      const schema = {
        type: 'object',
        properties: {
          version: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          brief: {
            type: 'string'
          },
          incidents: {
            type: 'number'
          }
        }
      }
      const collection = {
        'Entry 1': {
          version: '1.5.0',
          description: 'Lorem ipsum',
          brief: 'dolor sit amet',
          incidents: 1
        },
        'Entry 2': {
          version: '1.7.0',
          description: 'consectetur adipiscing elit',
          brief: 'Nulla condimentum',
          incidents: 2
        },
        'Entry 3': {
          version: '2.0.0',
          description: 'eu mollis',
          brief: 'finibus lorem',
          incidents: 3
        }
      }

      it('should correctly combine additional rules', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'incidents',
          operator: 'is',
          value: 1
        }, {
          field: 'brief',
          operator: 'contains',
          value: 'lorem'
        }])

        expect(sieve.filter(filter, collection)).toContainAllKeys([
          'Entry 1',
          'Entry 3'
        ])
      })
    })
  })

  describe('.getDataModel()', () => {
    const dataModelKeys = [
      'Edit',
      'operators',
      'createFilter',
      'decodeFilter'
    ]

    it('should return null if provided with a falsey value as the schema parameter', () => {
      expect(sieve.getDataModel()).toBe(null)
      expect(sieve.getDataModel(0)).toBe(null)
      expect(sieve.getDataModel(false)).toBe(null)
      expect(sieve.getDataModel(null)).toBe(null)
      expect(sieve.getDataModel('')).toBe(null)
    })

    it('should return null for unknown types', () => {
      const schema = {
        type: 'foobar'
      }

      expect(sieve.getDataModel(schema)).toBe(null)
    })

    it('should return a model for string types', () => {
      const schema = {
        type: 'string'
      }

      expect(sieve.getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for date-time formatted string types', () => {
      const schema = {
        type: 'string',
        format: 'date-time'
      }

      expect(sieve.getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for object types', () => {
      const schema = {
        type: 'object'
      }

      expect(sieve.getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for boolean types', () => {
      const schema = {
        type: 'boolean'
      }

      expect(sieve.getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })

    it('should return a model for number types', () => {
      const schema = {
        type: 'number'
      }

      expect(sieve.getDataModel(schema)).toContainAllKeys(dataModelKeys)
    })
  })

  describe('.createFullTextSearchFilter()', () => {
    const ajv = new Ajv()
    ajvKeywords(ajv)
    ajv.addMetaSchema(metaSchema6)

    it('should create a valid JSON schema', () => {
      const schema = {
        type: 'object',
        properties: {
          text: { type: 'string' }
        }
      }

      const filter = sieve.createFullTextSearchFilter(schema, 'test')

      expect(ajv.compile(filter)).not.toThrow()
    })
  })

  describe('.upsertFullTextSearch()', () => {
    it('should create and append a new filter if a search filter does not already exist', () => {
      const schema = {
        type: 'object',
        properties: {
          text: { type: 'string' }
        }
      }

      const filters = sieve.upsertFullTextSearch(schema, [], 'test')

      expect(filters).toHaveLength(1)
    })

    it('should modify an existing search filter', () => {
      const schema = {
        type: 'object',
        properties: {
          text: { type: 'string' }
        }
      }

      const existingFilters = [
        sieve.createFullTextSearchFilter(schema, 'test')
      ]

      const term = 'foobar'

      const filters = sieve.upsertFullTextSearch(schema, existingFilters, term)

      expect(filters).toHaveLength(1)
      expect(filters[0].anyOf[0].anyOf[0].properties.text.regexp.pattern).toBe(term)
    })
  })

  describe('.createFilter()', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        boolean: { type: 'boolean' },
        'date-time': {
          type: 'string',
          format: 'date-time'
        },
        object: {
          type: 'object',
          properties: {
            tag_name: {
              description: 'key',
              type: 'string'
            },
            tag_value: {
              description: 'value',
              type: 'string'
            }
          }
        },
        enum: {
          enum: [ 'foo', 'bar', 'baz' ]
        }
      }
    }

    // Run test for each operator for each type declared in the schema
    Object.keys(schema.properties).forEach(type => {
      const operators = sieve.getOperators(schema, type)

      operators.forEach(({ slug }) => {
        it(`should create a filter for the '${type}' type using operator '${slug}'`, () => {
          expect(
            sieve.createFilter(
              schema,
              [{
                field: type,
                operator: slug,
                value: 'test'
              }]
            )
          ).toContainAllKeys(['$id', 'anyOf'])
        })
      })
    })
  })

  describe('.decodeFilter()', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        boolean: { type: 'boolean' },
        'date-time': {
          type: 'string',
          format: 'date-time'
        },
        object: {
          type: 'object',
          properties: {
            tag_name: {
              description: 'key',
              type: 'string'
            },
            tag_value: {
              description: 'value',
              type: 'string'
            }
          }
        },
        enum: {
          enum: [ 'foo', 'bar', 'baz' ]
        }
      }
    }

    // Run test for each operator for each type declared in the schema
    Object.keys(schema.properties).forEach(type => {
      const operators = sieve.getOperators(schema, type)

      operators.forEach(({ slug }) => {
        it(`should decode a filter for the '${type}' type using operator '${slug}'`, () => {
          // We need to use an appropriate filter value for this test to work
          // correctly
          let value
          switch (type) {
          case 'boolean':
            value = true
            break
          case 'number':
            value = 900122
            break
          case 'object':
            value = { tag_name: 'foo', tag_value: 'bar' }
            break
          default:
            value = 'test'
          }

          const signatures = [{
            field: type,
            operator: slug,
            value
          }]
          const filter = sieve.createFilter(schema, signatures)

          expect(sieve.decodeFilter(schema, filter)).toEqual(signatures)
        })
      })
    })
  })

  describe('.getOperators()', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        boolean: { type: 'boolean' },
        'date-time': {
          type: 'string',
          format: 'date-time'
        },
        object: {
          type: 'object',
          properties: {
            tag_name: {
              description: 'key',
              type: 'string'
            },
            tag_value: {
              description: 'value',
              type: 'string'
            }
          }
        },
        enum: {
          enum: [ 'foo', 'bar', 'baz' ]
        }
      }
    }

    // Run test for each type declared in the schema
    Object.keys(schema.properties).forEach(type => {
      it(`should return an array of operators for the '${type}' type`, () =>
        sieve.getOperators(schema, type).forEach((operator) =>
          expect(operator).toContainAllKeys(['slug', 'label'])
        )
      )
    })
  })

  describe('.migrateLegacyFilter()', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        boolean: { type: 'boolean' },
        'date-time': {
          type: 'string',
          format: 'date-time'
        },
        object: {
          type: 'object',
          properties: {
            tag_name: {
              description: 'key',
              type: 'string'
            },
            tag_value: {
              description: 'value',
              type: 'string'
            }
          }
        },
        enum: {
          enum: [ 'foo', 'bar', 'baz' ]
        }
      }
    }

    // Legacy types and mappings for new --> old operator names
    // Bolean types are handled a little differently in v4 so we can't loop
    // through the tests in the same way
    const legacyTypesAndOperators = {
      'Case Insensitive Text': {
        v4Type: 'string',
        testValue: 'test',
        operators: {
          is: 'is',
          contains: 'contains',
          not_contains: 'does not contain',
          matches_re: 'matches RegEx',
          not_matches_re: 'does not match RegEx'
        }
      },
      'Date Time': {
        v4Type: 'date-time',
        testValue: '2018-03-26T11:43',
        operators: {
          is: 'is',
          is_after: 'is after',
          is_before: 'is before'
        }
      },
      'Date': {
        v4Type: 'date-time',
        testValue: '2018-03-26T11:43',
        operators: {
          is: 'is',
          is_after: 'is after',
          is_before: 'is before'
        }
      },
      'Integer': {
        v4Type: 'number',
        testValue: 900122,
        operators: {
          is: 'equals',
          is_more_than: 'more than',
          is_less_than: 'less than'
        }
      },
      'Key Value Pair': {
        v4Type: 'object',
        testValue: { tag_name: 'test', tag_value: 'test' },
        operators: {
          is: 'is',
          is_not: 'is_not',
          key_is: 'key is',
          key_contains: 'key contains',
          key_not_contains: 'key does not contain',
          key_matches_re: 'key matches RegEx',
          key_not_matches_re: 'key does not match RegEx',
          value_is: 'value is',
          value_contains: 'value contains',
          value_not_contains: 'value does not contain',
          value_matches_re: 'value matches RegEx',
          value_not_matches_re: 'value does not match RegEx'
        }
      },
      'Real': {
        v4Type: 'number',
        testValue: 900122,
        operators: {
          is: 'equals',
          is_more_than: 'more than',
          is_less_than: 'less than'
        }
      },
      'Short Text': {
        v4Type: 'string',
        testValue: 'test',
        operators: {
          is: 'is',
          contains: 'contains',
          not_contains: 'does not contain',
          matches_re: 'matches RegEx',
          not_matches_re: 'does not match RegEx'
        }
      },
      'Text': {
        v4Type: 'string',
        testValue: 'test',
        operators: {
          is: 'is',
          contains: 'contains',
          not_contains: 'does not contain',
          matches_re: 'matches RegEx',
          not_matches_re: 'does not match RegEx'
        }
      },
      'Time': {
        v4Type: 'date-time',
        testValue: '2018-03-26T11:43',
        operators: {
          is: 'is',
          is_after: 'is after',
          is_before: 'is before'
        }
      },
      'Enum': {
        v4Type: 'enum',
        testValue: 'test',
        operators: {
          is: 'is',
          is_not: 'is not'
        }
      }
    }

    it('should convert legacy Boolean type filters using the "is true" operator', () => {
      const legacyFilter = {
        name: 'boolean',
        value: '',
        operator: 'is true',
        type: 'Boolean'
      }

      const filter = sieve.createFilter(schema, [{
        field: 'boolean',
        operator: 'is',
        value: true
      }])

      expect(
        stripId(sieve.migrateLegacyFilter(schema, legacyFilter))
      ).toEqual(
        stripId(filter)
      )
    })

    it('should convert legacy Boolean type filters using the "is false" operator', () => {
      const legacyFilter = {
        name: 'boolean',
        value: '',
        operator: 'is false',
        type: 'Boolean'
      }

      const filter = sieve.createFilter(schema, [{
        field: 'boolean',
        operator: 'is',
        value: false
      }])

      expect(
        stripId(sieve.migrateLegacyFilter(schema, legacyFilter))
      ).toEqual(
        stripId(filter)
      )
    })

    _.forEach(legacyTypesAndOperators, ({ v4Type, operators, testValue }, legacyType) => {
      _.forEach(operators, (legacyOperator, v4Operator) => {
        it(`should convert legacy '${legacyType}' type filters that use the legacy '${legacyOperator}' operator`, () => {
          const legacyFilter = {
            name: v4Type,
            value: testValue,
            operator: legacyOperator,
            type: legacyType
          }

          const filter = sieve.createFilter(schema, [{
            field: v4Type,
            operator: v4Operator,
            value: testValue
          }])

          // If migrations are working correctly, the generated filters should
          // be the same (disregarding the unique id that is generated
          expect(
            stripId(sieve.migrateLegacyFilter(schema, legacyFilter))
          ).toEqual(
            stripId(filter)
          )
        })
      })
    })

    it(`should convert legacy 'Full Text Search' filters`, () => {
      const searchTerm = 'test'
      const legacyFilter = {
        name: 'Full text search',
        value: searchTerm
      }

      const filter = sieve.createFullTextSearchFilter(schema, searchTerm)

      expect(
        stripId(sieve.migrateLegacyFilter(schema, legacyFilter))
      ).toEqual(
        stripId(filter)
      )
    })
  })

  describe('.migrateLegacyViews()', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' }
      }
    }

    it('should migrate legacy views', () => {
      const legacyViews = [{
        key: 'global',
        scopeLabel: 'Everyone',
        title: 'Global',
        data: [{
          id: 'bizmeOiqYTCiLFzf',
          name: 'My view',
          scopeKey: 'global',
          rules: [{
            id: 'QGNwjQRd0rhQgIhl',
            name: 'string',
            operator: 'is',
            type: 'Text',
            value: 'test'
          }]
        }]
      }]

      const migrated = sieve.migrateLegacyViews(schema, legacyViews)

      // Remove the unique ids so we can match the data structures easily
      migrated.views[0].filters = migrated.views[0].filters.map(stripId)

      expect(migrated).toEqual({
        views: [{
          id: 'bizmeOiqYTCiLFzf',
          name: 'My view',
          scope: 'global',
          filters: [
            stripId(sieve.createFilter(schema, [{
              field: 'string',
              operator: 'is',
              value: 'test'
            }]))
          ]
        }],
        viewScopes: [{
          slug: 'global',
          name: 'Global',
          label: 'Everyone'
        }]
      })
    })
  })

  describe('.migrateLegacySchema()', () => {
    it('should correctly migrate legacy schemas', () => {
      const legacySchema = {
        'Boolean': {
          type: 'Boolean',
          label: 'on/off'
        },
        'Case Insensitive Text': {
          type: 'Case Insensitive Text'
        },
        'Date Time': {
          type: 'Date Time',
          label: 'First Seen'
        },
        'Date': {
          type: 'Date'
        },
        'Enum': {
          type: 'Enum',
          values: ['a', 'b', 'c']
        },
        'Integer': {
          type: 'Integer'
        },
        'Real': {
          type: 'Real'
        },
        'Short Text': {
          type: 'Short Text'
        },
        'Text': {
          type: 'Text'
        },
        'Time': {
          type: 'Time'
        },
        'Semver Range': {
          type: 'Semver Range'
        },
        'Semver': {
          type: 'Semver'
        },
        'Key Value Pair': {
          type: 'Key Value Pair',
          key: 'tag_name',
          value: 'tag_value',
          keyLabel: 'Name',
          valueLabel: 'Value'
        }
      }

      expect(sieve.migrateLegacySchema(legacySchema)).toEqual({
        type: 'object',
        properties: {
          'Boolean': {
            title: 'on/off',
            type: 'boolean'
          },
          'Case Insensitive Text': {
            type: 'string'
          },
          'Date Time': {
            title: 'First Seen',
            type: 'string',
            format: 'date-time'
          },
          'Date': {
            type: 'string',
            format: 'date-time'
          },
          'Enum': {
            enum: ['a', 'b', 'c']
          },
          'Integer': {
            type: 'number'
          },
          'Real': {
            type: 'number'
          },
          'Short Text': {
            type: 'string'
          },
          'Text': {
            type: 'string'
          },
          'Time': {
            type: 'string',
            format: 'date-time'
          },
          'Key Value Pair': {
            type: 'object',
            properties: {
              tag_name: {
                title: 'Name',
                description: 'key',
                type: 'string'
              },
              tag_value: {
                title: 'Value',
                description: 'value',
                type: 'string'
              }
            }
          }
        }
      })
    })
  })
})
