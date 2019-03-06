/* globals expect, describe, it */

import { runFormulas } from '../../src/unstable/components/JellyForm/formulas'

describe('JellyForm formula runner should', () => {
  it('not modify empty object', () => {
    const schema = {}
    const data = {}
    const ran = runFormulas(schema, data)
    expect(ran).toEqual(data)
  })

  it('not modify object without a schema', () => {
    const schema = {}
    const data = {
      hello: 'one',
      nested: {
        sub: 'two'
      },
      nestedArray: [
        {
          itemId: 'first'
        },
        {
          itemId: 'second'
        }
      ]
    }

    const ran = runFormulas(schema, data)
    expect(ran).toEqual(data)
  })

  describe('substitute formula text from schema', () => {
    it('on the the top level', () => {
      const schema = {
        type: 'object',
        properties: {
          time: {
            type: 'string',
            $$formula: 'NOW()'
          }
        }
      }
      const data = {
        time: 'some previous value'
      }

      const ran = runFormulas(schema, data)
      expect(ran).not.toEqual(data)
      expect(ran.time).toBeTruthy()
    })

    it('when wrapped in an object', () => {
      const schema = {
        type: 'object',
        properties: {
          wrapper: {
            type: 'object',
            properties: {
              time: {
                type: 'string',
                $$formula: 'NOW()'
              }
            }
          }
        }
      }
      const data = {
        wrapper: {
          time: 'some previous value'
        }
      }

      const ran = runFormulas(schema, data)
      expect(ran).not.toEqual(data)
      expect(ran.wrapper.time).toBeTruthy()
    })

    it('when wrapped in an array', () => {
      const schema = {
        type: 'object',
        properties: {
          wrapper: {
            type: 'array',
            items: {
              type: 'string',
              $$formula: 'NOW()'
            }
          }
        }
      }
      const data = {
        wrapper: [{
          time: 'some previous value'
        }]
      }

      const ran = runFormulas(schema, data)
      expect(ran).not.toEqual(data)
      expect(ran.wrapper[0]).toBeTruthy()
    })

    it('when wrapped in a nested array', () => {
      const schema = {
        type: 'object',
        properties: {
          wrapper: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                anotherWrapper: {
                  type: 'array',
                  items:
                    {
                      type: 'string',
                      $$formula: 'NOW()'
                    }}}}}}
      }

      const data = {
        wrapper: [{
          anotherWrapper: [{
            time: 'some previous value'
          }]
        }]
      }

      const ran = runFormulas(schema, data)
      expect(ran).not.toEqual(data)
      expect(ran.wrapper[0].anotherWrapper[0]).toBeTruthy()
    })
  })
})
