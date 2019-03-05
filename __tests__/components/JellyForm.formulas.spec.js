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
    it('when wrapped in object', () => {
      const schema = {
        properties: {
          wrapper: {
            time: {
              type: 'string',
              $$formula: 'NOW()'
            }}
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
  })
})
