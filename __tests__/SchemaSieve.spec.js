/* globals expect, describe, it */
import isArray from 'lodash/isArray'
import mapValues from 'lodash/mapValues'
import { JSDOM } from 'jsdom'
const Ajv = require('ajv')
const ajvKeywords = require('ajv-keywords')
const metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json')
global.document = (new JSDOM('')).window.document

import { SchemaSieve as sieve } from '../src'

const expectMatchesKeys = (data, keys) =>
  expect(Object.keys(data).sort()).toEqual(keys.sort())

describe('SchemaSieve', () => {
  describe('.filter()', () => {
    // Utility function for batch testing schema/operator combinations
    const testFilter = (field, schema, collection, tests) => {
      const nestedSchema = {
        type: 'object',
        properties: {
          data: schema
        }
      }

      const nestedCollection = mapValues(collection, (value) => ({ data: value }))

      tests.forEach(({ operator, value, expected }) => {
        it(`should correctly test values using the "${operator}" operator with a value of "${value}"`, function () {
          const filter = sieve.createFilter(schema, [{
            field,
            operator,
            value
          }])

          const result = sieve.filter(filter, collection)

          expectMatchesKeys(result, expected)
        })
      })

      tests.forEach(({ operator, value, expected }) => {
        it(`should correctly test values using a nested schema and the "${operator}" operator with a value of "${value}"`, function () {
          // Flattend/Unflatten happens 'behind the scenes' in the filter
          // component when creating filters. The methods are used here directly
          // to simulate the Filters behaviour.
          const filter = sieve.createFilter(sieve.flattenSchema(nestedSchema), [{
            field: '___data___' + field,
            operator,
            value
          }])

          const result = sieve.filter(sieve.unflattenSchema(filter), nestedCollection)

          expectMatchesKeys(result, expected)
        })
      })
    }

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
        },
        'Entry 6': {
          foo: 'bar'
        }
      }

      const tests = [
        {
          operator: 'is',
          value: 'abcde',
          expected: ['Entry 1']
        },
        {
          operator: 'contains',
          value: 'BCd',
          expected: ['Entry 4']
        },
        {
          operator: 'not_contains',
          value: 'ABC',
          expected: [
            'Entry 1',
            'Entry 2',
            'Entry 3',
            'Entry 5',
            'Entry 6'
          ]
        },
        {
          operator: 'matches_re',
          value: 'ABC',
          expected: ['Entry 4']
        },
        {
          operator: 'not_matches_re',
          value: 'ghi',
          expected: [
            'Entry 1',
            'Entry 3',
            'Entry 4',
            'Entry 5',
            'Entry 6'
          ]
        }
      ]

      testFilter('test', schema, collection, tests)
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
        },
        'Entry 6': {
          Tag: [{
            hello: 'world',
            foo: 'bar',
            tag_name: 'Ee',
            tag_value: '161718'
          }]
        }
      }

      const tests = [
        {
          operator: 'is',
          value: {
            tag_name: 'Aa',
            tag_value: '123'
          },
          expected: [ 'Entry 1' ]
        },
        {
          operator: 'is_not',
          value: {
            tag_name: 'Aa',
            tag_value: '123'
          },
          expected: [
            'Entry 2',
            'Entry 3',
            'Entry 4',
            'Entry 5',
            'Entry 6'
          ]
        },
        {
          operator: 'key_is',
          value: {
            tag_name: 'Dd'
          },
          expected: [ 'Entry 4' ]
        },
        {
          operator: 'key_contains',
          value: {
            tag_name: 'b'
          },
          expected: [ 'Entry 2', 'Entry 3' ]
        },
        {
          operator: 'key_not_contains',
          value: {
            tag_name: 'b'
          },
          expected: [ 'Entry 1', 'Entry 4', 'Entry 5', 'Entry 6' ]
        },
        {
          operator: 'key_matches_re',
          value: {
            tag_name: 'b'
          },
          expected: [
            'Entry 2',
            'Entry 3'
          ]
        },
        {
          operator: 'key_not_matches_re',
          value: {
            tag_name: 'b'
          },
          expected: [ 'Entry 1', 'Entry 4', 'Entry 5', 'Entry 6' ]
        },
        {
          operator: 'value_is',
          value: {
            tag_value: '123'
          },
          expected: [ 'Entry 1' ]
        },
        {
          operator: 'value_contains',
          value: {
            tag_value: '23'
          },
          expected: [ 'Entry 1' ]
        },
        {
          operator: 'value_not_contains',
          value: {
            tag_value: '1'
          },
          expected: [ 'Entry 2', 'Entry 5' ]
        },
        {
          operator: 'value_matches_re',
          value: {
            tag_value: '56'
          },
          expected: [ 'Entry 2' ]
        },
        {
          operator: 'value_not_matches_re',
          value: {
            tag_value: '1'
          },
          expected: [ 'Entry 2', 'Entry 5' ]
        }
      ]

      testFilter('Tag', schema, collection, tests)

      it('should correctly test values using the "is" operator when there are additional properties', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'Tag',
          operator: 'is',
          value: {
            tag_name: 'Ee',
            tag_value: '161718'
          }
        }])

        const result = sieve.filter(filter, collection)

        expectMatchesKeys(result, ['Entry 6'])
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
          date: '2017-01-01T08:49:26Z'
        },
        'Entry 2': {
          date: '2012-01-01T00:00:00Z'
        },
        'Entry 3': {
          date: null
        },
        'Entry 4': {
          foo: 'bar'
        }
      }

      const tests = [
        {
          operator: 'is',
          value: '2017-01-01T08:49:26.000Z',
          expected: [ 'Entry 1' ]
        },
        {
          operator: 'is_before',
          value: '2016-12-25T00:00:00.000Z',
          expected: [ 'Entry 2' ]
        },
        {
          operator: 'is_after',
          value: '2016-12-25T00:00:00.000Z',
          expected: [ 'Entry 1' ]
        }
      ]

      testFilter('date', schema, collection, tests)

      it('should correctly test values using the "is" operator where the date is not in the RFC3339 format', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'date',
          operator: 'is',
          // This is a RFC2882 formatted date
          value: 'Sun, 01 Jan 2017 08:49:26 +0000'
        }])

        expectMatchesKeys(sieve.filter(filter, collection), ['Entry 1'])
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
        },
        'Entry 4': {
          foo: 'bar'
        }
      }

      const tests = [
        {
          operator: 'is',
          value: true,
          expected: ['Entry 1']
        },
        {
          operator: 'is',
          value: false,
          expected: ['Entry 2']
        }
      ]

      testFilter('bool', schema, collection, tests)
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
          score: 2.3
        },
        'Entry 3': {
          score: 3.19
        },
        'Entry 4': {
          score: null
        },
        'Entry 5': {
          foo: 'bar'
        }
      }

      const tests = [
        {
          operator: 'is',
          value: 1.5,
          expected: [ 'Entry 1' ]
        },
        {
          operator: 'is_more_than',
          value: 2.3,
          expected: [ 'Entry 3' ]
        },
        {
          operator: 'is_less_than',
          value: 3.19,
          expected: [ 'Entry 1', 'Entry 2' ]
        }
      ]

      testFilter('score', schema, collection, tests)
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
        },
        'Entry 5': {
          foo: 'bar'
        }
      }

      const tests = [
        {
          operator: 'is',
          value: 'Flame',
          expected: ['Entry 1']
        },
        {
          operator: 'is_not',
          value: 'Seed',
          expected: [
            'Entry 1',
            'Entry 2',
            'Entry 4',
            'Entry 5'
          ]
        }
      ]

      testFilter('category', schema, collection, tests)
    })

    describe('array types', () => {
      describe('where items are strings', () => {
        const schema = {
          type: 'object',
          properties: {
            category: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }

        const collection = {
          'Entry 1': {
            category: [ 'Flame' ]
          },
          'Entry 2': {
            category: [ 'Lizard' ]
          },
          'Entry 3': {
            category: [ 'Seed' ]
          },
          'Entry 4': {
            category: null
          },
          'Entry 5': {
            foo: 'bar'
          }
        }

        const tests = [
          {
            operator: 'contains',
            value: 'Flame',
            expected: ['Entry 1']
          },
          {
            operator: 'not_contains',
            value: 'Seed',
            expected: [
              'Entry 1',
              'Entry 2',
              'Entry 4',
              'Entry 5'
            ]
          }
        ]

        testFilter('category', schema, collection, tests)
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
        },
        'Entry 4': {
          foo: 'bar'
        }
      }

      it('should correctly test values', function () {
        const filter = sieve.createFullTextSearchFilter(schema, 'Lorem')

        expectMatchesKeys(sieve.filter(filter, collection), [
          'Entry 1',
          'Entry 3'
        ])
      })

      it('should correctly test values using a nested schema', function () {
        const nestedSchema = {
          type: 'object',
          properties: {
            data: schema
          }
        }

        const nestedCollection = mapValues(collection, (value) => ({ data: value }))

        const filter = sieve.createFullTextSearchFilter(sieve.flattenSchema(nestedSchema), 'lorem')

        const result = sieve.filter(sieve.unflattenSchema(filter), nestedCollection)

        expectMatchesKeys(result, [
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
        expect(isArray(result)).toBe(true)
      })

      it('should return the correct values', function () {
        const filter = sieve.createFilter(schema, [{
          field: 'test',
          operator: 'contains',
          value: 'abc'
        }])

        const result = sieve.filter(filter, collection)
        expect(result).toHaveLength(1)
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
        expect(result).toHaveLength(1)
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

        expectMatchesKeys(sieve.filter(filter, collection), [
          'Entry 1',
          'Entry 3'
        ])
      })
    })
  })

  describe('.createFullTextSearchFilter()', () => {
    const ajv = new Ajv()
    ajvKeywords(ajv, [
      'regexp',
      'formatMaximum',
      'formatMinimum'
    ])
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
    const collection = [
      {
        test: 'abcde',
        description: 'maecenas convallis aliquet arcu sed faucibus'
      },
      {
        test: 'fghij',
        description: 'lorem ipsum dolor sit amet'
      }
    ]

    it('should create and append a new filter if a search filter does not already exist', () => {
      const schema = {
        type: 'object',
        properties: {
          test: { type: 'string' },
          description: { type: 'string' }
        }
      }

      const term = 'lorem'

      const filters = sieve.upsertFullTextSearch(schema, [], term)

      expect(filters).toHaveLength(1)
      expect(sieve.filter(filters, collection)).toHaveLength(1)
      expect(sieve.filter(filters, collection)).toEqual([collection[1]])

      expect(filters).toHaveLength(1)
    })

    it('should modify an existing search filter', () => {
      const schema = {
        type: 'object',
        properties: {
          test: { type: 'string' },
          description: { type: 'string' }
        }
      }

      const existingFilters = [
        sieve.createFullTextSearchFilter(schema, 'test')
      ]

      const term = 'lorem'

      const filters = sieve.upsertFullTextSearch(schema, existingFilters, term)

      expect(filters).toHaveLength(1)
      expect(sieve.filter(filters, collection)).toHaveLength(1)
      expect(sieve.filter(filters, collection)).toEqual([collection[1]])
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
        },
        array: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }

    // Run test for each operator for each type declared in the schema
    Object.keys(schema.properties).forEach(type => {
      const operators = sieve.getOperators(schema, type)

      operators.forEach(({ slug }) => {
        it(`should create a filter for the '${type}' type using operator '${slug}'`, () => {
          const result = sieve.createFilter(
            schema,
            [{
              field: type,
              operator: slug,
              value: 'test'
            }]
          )

          expectMatchesKeys(result, ['$id', 'anyOf'])
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
          case 'date-time':
            value = '2017-01-01T08:49:26Z'
            break
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
          expectMatchesKeys(operator, ['slug', 'label'])
        )
      )
    })
  })

  describe('.flattenSchema()', () => {
    it('should flatten a schema correctly', () => {
      const schema = {
        type: 'object',
        properties: {
          string: { type: 'string' },
          nestedString: {
            type: 'object',
            properties: {
              string: { type: 'string' }
            }
          },
          nestedNumber: {
            type: 'object',
            properties: {
              number: { type: 'number' }
            }
          },
          nestedBoolean: {
            type: 'object',
            properties: {
              boolean: { type: 'boolean' }
            }
          },
          nestedDateTime: {
            type: 'object',
            properties: {
              'date-time': {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          nestedObject: {
            type: 'object',
            properties: {
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
              }
            }
          },
          nestedEnum: {
            type: 'object',
            properties: {
              enum: {
                enum: [ 'foo', 'bar', 'baz' ]
              }
            }
          },
          nestedMultiple: {
            type: 'object',
            properties: {
              string: { type: 'string' },
              number: { type: 'number' }
            }
          },
          nestedLevels: {
            type: 'object',
            properties: {
              level: {
                type: 'object',
                properties: {
                  string: { type: 'string' }
                }
              }
            }
          }
        }
      }

      expect(sieve.flattenSchema(schema)).toEqual({
        type: 'object',
        properties: {
          string: { type: 'string' },
          ___nestedString___string: {
            title: 'string',
            type: 'string'
          },
          ___nestedNumber___number: {
            title: 'number',
            type: 'number'
          },
          ___nestedBoolean___boolean: {
            title: 'boolean',
            type: 'boolean'
          },
          '___nestedDateTime___date-time': {
            title: 'date-time',
            type: 'string',
            format: 'date-time'
          },
          ___nestedObject___object: {
            title: 'object',
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
          ___nestedEnum___enum: {
            title: 'enum',
            enum: [ 'foo', 'bar', 'baz' ]
          },
          ___nestedMultiple___string: {
            title: 'string',
            type: 'string'
          },
          ___nestedMultiple___number: {
            title: 'number',
            type: 'number'
          },
          ___nestedLevels___level___string: {
            title: 'string',
            type: 'string'
          }
        }
      })
    })

    it('should preserve titles when flattening', () => {
      const schema = {
        type: 'object',
        properties: {
          nestedString: {
            type: 'object',
            properties: {
              string: {
                title: 'A string field',
                type: 'string'
              }
            }
          }
        }
      }

      expect(sieve.flattenSchema(schema)).toEqual({
        type: 'object',
        properties: {
          ___nestedString___string: {
            title: 'A string field',
            type: 'string'
          }
        }
      })
    })

    it('should work with the "anyOf" keyword', () => {
      const schema = {
        anyOf: [{
          type: 'object',
          properties: {
            nestedString: {
              type: 'object',
              properties: {
                string: {
                  title: 'A string field',
                  type: 'string'
                }
              }
            }
          }
        }]
      }

      expect(sieve.flattenSchema(schema)).toEqual({
        anyOf: [{
          type: 'object',
          properties: {
            ___nestedString___string: {
              title: 'A string field',
              type: 'string'
            }
          }
        }]
      })
    })

    it('should allow a custom delimiter to be used', () => {
      const schema = {
        type: 'object',
        properties: {
          string: { type: 'string' },
          nestedString: {
            type: 'object',
            properties: {
              string: { type: 'string' }
            }
          },
          nestedNumber: {
            type: 'object',
            properties: {
              number: { type: 'number' }
            }
          },
          nestedBoolean: {
            type: 'object',
            properties: {
              boolean: { type: 'boolean' }
            }
          }
        }
      }

      expect(sieve.flattenSchema(schema, '$$$')).toEqual({
        type: 'object',
        properties: {
          string: { type: 'string' },
          $$$nestedString$$$string: {
            title: 'string',
            type: 'string'
          },
          $$$nestedNumber$$$number: {
            title: 'number',
            type: 'number'
          },
          $$$nestedBoolean$$$boolean: {
            title: 'boolean',
            type: 'boolean'
          }
        }
      })
    })
  })

  describe('.unflattenSchema()', () => {
    it('should unflatten a schema correctly', () => {
      const schema = {
        type: 'object',
        properties: {
          string: { type: 'string' },
          nestedString: {
            type: 'object',
            properties: {
              string: { type: 'string' }
            }
          },
          nestedNumber: {
            type: 'object',
            properties: {
              number: { type: 'number' }
            }
          },
          nestedBoolean: {
            type: 'object',
            properties: {
              boolean: { type: 'boolean' }
            }
          },
          nestedDateTime: {
            type: 'object',
            properties: {
              'date-time': {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          nestedObject: {
            type: 'object',
            properties: {
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
              }
            }
          },
          nestedEnum: {
            type: 'object',
            properties: {
              enum: {
                enum: [ 'foo', 'bar', 'baz' ]
              }
            }
          },
          nestedMultiple: {
            type: 'object',
            properties: {
              string: { type: 'string' },
              number: { type: 'number' }
            }
          },
          nestedLevels: {
            type: 'object',
            properties: {
              level: {
                type: 'object',
                properties: {
                  string: { type: 'string' }
                }
              }
            }
          }
        }
      }

      const flattenedSchema = sieve.flattenSchema(schema)

      expect(sieve.unflattenSchema(flattenedSchema)).toEqual(schema)
    })

    it('should work with the "anyOf" keyword', () => {
      const schema = {
        anyOf: [{
          type: 'object',
          properties: {
            string: { type: 'string' },
            nestedString: {
              type: 'object',
              properties: {
                string: { type: 'string' }
              }
            },
            nestedNumber: {
              type: 'object',
              properties: {
                number: { type: 'number' }
              }
            },
            nestedBoolean: {
              type: 'object',
              properties: {
                boolean: { type: 'boolean' }
              }
            },
            nestedDateTime: {
              type: 'object',
              properties: {
                'date-time': {
                  type: 'string',
                  format: 'date-time'
                }
              }
            },
            nestedObject: {
              type: 'object',
              properties: {
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
                }
              }
            },
            nestedEnum: {
              type: 'object',
              properties: {
                enum: {
                  enum: [ 'foo', 'bar', 'baz' ]
                }
              }
            },
            nestedMultiple: {
              type: 'object',
              properties: {
                string: { type: 'string' },
                number: { type: 'number' }
              }
            },
            nestedLevels: {
              type: 'object',
              properties: {
                level: {
                  type: 'object',
                  properties: {
                    string: { type: 'string' }
                  }
                }
              }
            }
          }
        }]
      }

      const flattenedSchema = sieve.flattenSchema(schema)

      expect(sieve.unflattenSchema(flattenedSchema)).toEqual(schema)
    })

    it('should preserve the "required" keyword', () => {
      const flattenedSchema = {
        type: 'object',
        properties: {
          ___nestedString___string: {
            title: 'A string field',
            type: 'string'
          }
        },
        required: [ '___nestedString___string' ]
      }

      expect(sieve.unflattenSchema(flattenedSchema)).toEqual({
        type: 'object',
        properties: {
          nestedString: {
            type: 'object',
            properties: {
              string: {
                title: 'A string field',
                type: 'string'
              }
            },
            required: [ 'string' ]
          }
        },
        required: [ 'nestedString' ]
      })
    })

    it('should allow a custom delimiter to be used', () => {
      const flattenedSchema = {
        type: 'object',
        properties: {
          string: { type: 'string' },
          $$$nestedString$$$string: {
            type: 'string'
          },
          $$$nestedNumber$$$number: {
            type: 'number'
          },
          $$$nestedBoolean$$$boolean: {
            type: 'boolean'
          }
        }
      }

      expect(sieve.unflattenSchema(flattenedSchema, '$$$')).toEqual({
        type: 'object',
        properties: {
          string: { type: 'string' },
          nestedString: {
            type: 'object',
            properties: {
              string: { type: 'string' }
            }
          },
          nestedNumber: {
            type: 'object',
            properties: {
              number: { type: 'number' }
            }
          },
          nestedBoolean: {
            type: 'object',
            properties: {
              boolean: { type: 'boolean' }
            }
          }
        }
      })
    })
  })
})
