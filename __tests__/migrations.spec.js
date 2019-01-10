/* globals expect, describe, it */
import forEach from 'lodash/forEach'
import { JSDOM } from 'jsdom'
global.document = (new JSDOM('')).window.document

import { migrations, SchemaSieve as sieve } from '../src'

// Small filter function to help with asserting function output
// This strips the '$id' key from filter schemas
const stripId = (filter) => {
  delete filter.$id
  filter.anyOf.forEach(subFilter => delete subFilter.$id)
  return filter
}

describe('migrations', () => {
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
        testValue: { tag_name: 'testName', tag_value: 'testValue' },
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
        stripId(migrations.migrateLegacyFilter(schema, legacyFilter))
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
        stripId(migrations.migrateLegacyFilter(schema, legacyFilter))
      ).toEqual(
        stripId(filter)
      )
    })

    forEach(legacyTypesAndOperators, ({ v4Type, operators, testValue }, legacyType) => {
      forEach(operators, (legacyOperator, v4Operator) => {
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
            stripId(migrations.migrateLegacyFilter(schema, legacyFilter))
          ).toEqual(
            stripId(filter)
          )
        })
      })
    })

    it('should ignore input that is already migrated', () => {
      const newSchema = {
        type: 'object',
        properties: {
          is_running_latest__release: {
            title: 'Running Latest Release',
            type: 'boolean'
          }
        }
      }

      const oldFilter = {
        type: 'Boolean',
        name: 'is_running_latest__release',
        label: 'Running Latest Release',
        availableOperators: [
          {
            label: 'is true',
            value: 'is true'
          },
          {
            label: 'is false',
            value: 'is false'
          }
        ],
        operator: 'is true',
        value: '',
        id: 'tOYR2EqLICRfS1cS'
      }

      const testData = [
        {
          id: 1,
          is_running_latest__release: false
        },
        {
          id: 2,
          is_running_latest__release: true
        }
      ]

      const migratedFilter = migrations.migrateLegacyFilter(newSchema, oldFilter)

      const reMigratedFilter = migrations.migrateLegacyFilter(newSchema, migratedFilter)
      expect(reMigratedFilter).toEqual(migratedFilter)

      const results = sieve.filter([reMigratedFilter], testData)

      expect(results.length).toEqual(1)
      expect(results[0].id).toEqual(2)
    })

    it(`should convert legacy 'Full Text Search' filters`, () => {
      const searchTerm = 'test'
      const legacyFilter = {
        name: 'Full text search',
        value: searchTerm
      }

      const filter = sieve.createFullTextSearchFilter(schema, searchTerm)

      expect(
        stripId(migrations.migrateLegacyFilter(schema, legacyFilter))
      ).toEqual(
        stripId(filter)
      )
    })

    it('should convert legacy compound filters', () => {
      const legacyFilter = {
        name: 'boolean',
        value: '',
        operator: 'is false',
        type: 'Boolean',
        extra: {
          or: [{
            name: 'string',
            value: 'test',
            operator: 'is',
            type: 'Short Text'
          }]
        }
      }

      const filter = sieve.createFilter(schema, [{
        field: 'boolean',
        operator: 'is',
        value: false
      }, {
        field: 'string',
        operator: 'is',
        value: 'test'
      }])

      expect(
        stripId(migrations.migrateLegacyFilter(schema, legacyFilter))
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

      const migrated = migrations.migrateLegacyViews(schema, legacyViews)

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

    it('should ignore views that have already been migrated', () => {
      const preMigratedViews = [{
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
      }]

      const migrated = migrations.migrateLegacyViews(schema, preMigratedViews)

      expect(migrated.views).toEqual(preMigratedViews)
    })

    it('should ignore input that is already migrated', () => {
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

      const migrated = migrations.migrateLegacyViews(
        schema,
        migrations.migrateLegacyViews(schema, legacyViews)
      )

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

      expect(migrations.migrateLegacySchema(legacySchema)).toEqual({
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
