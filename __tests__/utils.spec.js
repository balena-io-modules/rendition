/* globals expect, describe, it */
import * as utils from '../src/utils'

describe('utils', () => {
  describe('.stripSchemaFormats()', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'string',
              format: 'uri'
            }
          }
        },
        baz: {
          type: 'string',
          format: 'uuid'
        },
        buzz: {
          type: 'string',
          format: 'email'
        }
      }
    }

    it('should remove formats from a schema', () => {
      expect(utils.stripSchemaFormats(schema)).toEqual({
        type: 'object',
        properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {
                type: 'string'
              }
            }
          },
          baz: {
            type: 'string'
          },
          buzz: {
            type: 'string'
          }
        }
      })
    })

    it('should allow a whitelist of formats', () => {
      const whitelist = [
        'email',
        'uri'
      ]
      expect(utils.stripSchemaFormats(schema, whitelist)).toEqual({
        type: 'object',
        properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {
                type: 'string',
                format: 'uri'
              }
            }
          },
          baz: {
            type: 'string'
          },
          buzz: {
            type: 'string',
            format: 'email'
          }
        }
      })
    })
  })

  describe('.disallowAdditionalProperties()', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'string'
            }
          },
          additionalProperties: true
        }
      },
      additionalProperties: true
    }

    it('should remove formats from a schema', () => {
      expect(utils.disallowAdditionalProperties(schema)).toEqual({
        type: 'object',
        properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {
                type: 'string'
              }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      })
    })

    it('should not modify the original schema', () => {
      utils.disallowAdditionalProperties(schema)

      expect(schema).toEqual({
        type: 'object',
        properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {
                type: 'string'
              }
            },
            additionalProperties: true
          }
        },
        additionalProperties: true
      })
    })
  })
})
