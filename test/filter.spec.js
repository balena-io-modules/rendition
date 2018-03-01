/* eslint-env mocha */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
global.document = (new JSDOM('')).window.document

import { SchemaSieve } from '../src'

const sieve = SchemaSieve()

describe('resin-filter', () => {
  describe('.filter()', () => {
    /**
     * Boolean
     */
    describe('Boolean', () => {
      before(function () {
        this.schema = { test: { type: 'Boolean' } }
        this.collection = {
          'Entry 1': {
            test: true
          },
          'Entry 2': {
            test: false
          },
          'Entry 3': {
            test: null
          }
        }
      })

      it('should correctly test values using the "is true" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is true'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is false" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is false'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })
    })

    /**
     * Case Insensitive Text
     */
    describe('Case Insensitive Text', () => {
      before(function () {
        this.schema = { test: { type: 'Case Insensitive Text' } }
        this.collection = {
          'Entry 1': {
            test: 'abcde'
          },
          'Entry 2': {
            test: 'fghi'
          },
          'Entry 3': {
            test: null
          }
        }
      })

      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        // Set a value
        input.value = 'ABCDE'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'contains' operator
        input.operator = 'contains'
        // Set a value
        input.value = 'BCD'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'does not contain' operator
        input.operator = 'does not contain'
        // Set a value
        input.value = 'bCd'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })

      it('should correctly test values using the "matches RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'matches RegEx'
        input.value = '/Fg/'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
      })

      it('should correctly test values using the "does not match RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'does not match RegEx'
        input.value = '/FG/g'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 3'
        )
      })
    })

    /**
     * Date Time
     */
    describe('Date Time', () => {
      before(function () {
        this.schema = { test: { type: 'Date' } }
        this.collection = {
          'Entry 1': {
            test: '2017-01-01T08:49:26.961Z'
          },
          'Entry 2': {
            test: '2012-01-01T00:00:00.000Z'
          },
          'Entry 3': {
            test: null
          }
        }
      })
      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        input.value = '2017-01-01T08:49:26.961Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is before" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is before'
        input.value = '2016-12-25T00:00:00.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
      })

      it('should correctly test values using the "is after" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is after'
        input.value = '2016-12-25T00:00:00.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })
    })

    /**
     * Date
     */
    describe('Date', () => {
      before(function () {
        this.schema = { test: { type: 'Date' } }
        this.collection = {
          'Entry 1': {
            test: '2017-01-01T08:49:26.961Z'
          },
          'Entry 2': {
            test: '2012-01-01T00:00:00.000Z'
          },
          'Entry 3': {
            test: null
          }
        }
      })
      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        input.value = '2017-01-01T00:00:00.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is before" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is before'
        input.value = '2016-12-25T00:00:00.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
      })

      it('should correctly test values using the "is after" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is after'
        input.value = '2016-12-25T00:00:00.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })
    })

    /**
     * Integer
     */
    describe('Integer', () => {
      before(function () {
        this.schema = { test: { type: 'Integer' } }
        this.collection = {
          'Entry 1': {
            test: 1
          },
          'Entry 2': {
            test: '2'
          },
          'Entry 3': {
            test: 3
          },
          'Entry 4': {
            test: null
          }
        }
      })

      it('should correctly test values using the "equals" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'equals'
        input.value = 1
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')

        input.value = 2
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')

        input.value = 3.4
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')
      })

      it('should correctly test values using the "more than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'more than'

        input.value = 1
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )

        input.value = 2
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')

        input.value = 2.7
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')
      })

      it('should correctly test values using the "less than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'less than'
        input.value = 3
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2'
        )

        input.value = 2.3
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })
    })

    /**
     * Key Value Pair
     */
    describe('Key Value Pair', () => {
      before(function () {
        this.schema = {
          test: {
            type: 'Key Value Pair',
            key: 'key',
            value: 'value'
          }
        }

        this.collection = {
          'Entry 1': {
            test: {
              letter: 'Aa',
              number: '123'
            }
          },
          'Entry 2': {
            test: {
              letter: 'Bb',
              number: '456'
            }
          },
          'Entry 3': {
            test: [
              {
                letter: 'Cc',
                number: '789'
              },
              {
                letter: 'Bb',
                number: '101112'
              }
            ]
          },
          'Entry 4': {
            test: {
              letter: 'Dd',
              number: '131415'
            }
          },
          'Entry 5': {
            foo: 'bar'
          }
        }
      })

      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        input.value = {
          letter: 'Aa',
          number: '123'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is not" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is not'
        input.value = {
          letter: 'Aa',
          number: '123'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3',
          'Entry 4',
          'Entry 5'
        )
      })

      it('should correctly test values using the "key is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'key is'
        input.value = {
          letter: 'Dd'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 4')
      })

      it('should correctly test values using the "key contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'key contains'
        input.value = {
          letter: 'b'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })

      it('should correctly test values using the "key does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'key does not contain'
        input.value = {
          letter: 'b'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 4',
          'Entry 5'
        )
      })

      it('should correctly test values using the "key matches RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'key matches RegEx'
        input.value = {
          letter: '/b/'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })

      it('should correctly test values using the "key does not match RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'key does not match RegEx'
        input.value = {
          letter: '/b/'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 4',
          'Entry 5'
        )
      })

      it('should correctly test values using the "value is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'value is'
        input.value = {
          number: '123'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "value contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'value contains'
        input.value = {
          number: '23'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "value does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'value does not contain'
        input.value = {
          number: '1'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 5'
        )
      })

      it('should correctly test values using the "value matches RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'value matches RegEx'
        input.value = {
          number: '/56/'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
      })

      it('should correctly test values using the "value does not match RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'value does not match RegEx'
        input.value = {
          number: '/1/'
        }
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 5'
        )
      })
    })

    /**
     * Real
     */
    describe('Real', () => {
      before(function () {
        this.schema = { test: { type: 'Real' } }
        this.collection = {
          'Entry 1': {
            test: 1.5
          },
          'Entry 2': {
            test: '2.3'
          },
          'Entry 3': {
            test: 3.19
          },
          'Entry 4': {
            test: null
          }
        }
      })

      it('should correctly test values using the "equals" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'equals'
        input.value = 1.5
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')

        input.value = 2.3
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')

        input.value = 3.19
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')
      })

      it('should correctly test values using the "more than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'more than'

        input.value = 1
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2',
          'Entry 3'
        )

        input.value = 2
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )

        input.value = 2.7
        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')
      })

      it('should correctly test values using the "less than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'less than'
        input.value = 3
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2'
        )

        input.value = 2.4
        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2'
        )
      })
    })

    /**
     * Short Text
     */
    describe('Short Text', () => {
      before(function () {
        this.schema = { test: { type: 'Short Text' } }
        this.collection = {
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
      })

      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        // Set a value
        input.value = 'abcde'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'contains' operator
        input.operator = 'contains'
        // Set a value
        input.value = 'BCd'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 4')
      })

      it('should correctly test values using the "does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'does not contain' operator
        input.operator = 'does not contain'
        // Set a value
        input.value = 'ABC'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2',
          'Entry 3',
          'Entry 5'
        )
      })

      it('should correctly test values using the "matches RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'matches RegEx'
        input.value = '/ABC/'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 4')
      })

      it('should correctly test values using the "does not match RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'does not match RegEx'
        input.value = '/ghi/g'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 3',
          'Entry 4',
          'Entry 5'
        )
      })
    })

    /**
     * Text
     */
    describe('Text', () => {
      before(function () {
        this.schema = { test: { type: 'Short Text' } }
        this.collection = {
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
      })

      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        // Set a value
        input.value = 'abcde'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'contains' operator
        input.operator = 'contains'
        // Set a value
        input.value = 'BCd'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 4')
      })

      it('should correctly test values using the "does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        // Set the 'does not contain' operator
        input.operator = 'does not contain'
        // Set a value
        input.value = 'ABC'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2',
          'Entry 3',
          'Entry 5'
        )
      })

      it('should correctly test values using the "matches RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'matches RegEx'
        input.value = '/ABC/'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 4')
      })

      it('should correctly test values using the "does not match RegEx" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'does not match RegEx'
        input.value = '/ghi/g'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 3',
          'Entry 4',
          'Entry 5'
        )
      })
    })

    /**
     * Time
     */
    describe('Time', () => {
      before(function () {
        this.schema = { test: { type: 'Time' } }
        this.collection = {
          'Entry 1': {
            test: '2017-01-01T08:49:26.961Z'
          },
          'Entry 2': {
            test: '2012-01-01T14:43:02.000Z'
          },
          'Entry 3': {
            test: null
          }
        }
      })
      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        input.value = '2015-11-10T08:49:26.961Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is before" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is before'
        input.value = '2012-01-01T11:43:02.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
      })

      it('should correctly test values using the "is after" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is after'
        input.value = '2017-11-01T11:43:02.000Z'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
      })
    })

    /**
     * Semver Range
     */
    describe('Semver Range', () => {
      before(function () {
        this.schema = { test: { type: 'Semver Range' } }
        this.collection = {
          'Entry 1': {
            test: '> 1.5.0'
          },
          'Entry 2': {
            test: '< 1.7.0'
          },
          'Entry 3': {
            test: null
          }
        }
      })

      it('should correctly test values using the "contains" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'contains'
        input.value = 'Resin OS 2.0.5'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')

        input.value = 'Resin OS 1.6.0'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2'
        )
      })

      it('should correctly test values using the "does not contain" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'does not contain'
        input.value = 'Resin OS 1.4.0'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 3'
        )
      })
    })

    /**
     * Semver
     */
    describe('Semver', () => {
      before(function () {
        this.schema = { test: { type: 'Semver' } }
        this.collection = {
          'Entry 1': {
            test: '1.5.0'
          },
          'Entry 2': {
            test: '1.7.0'
          },
          'Entry 3': {
            test: '2.0.0'
          },
          'Entry 4': {
            test: null
          }
        }
      })

      it('should correctly test values using the "is" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is'
        input.value = 'Resin OS 2.0.0'

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 3')
      })

      it('should correctly test values using the "is greater than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is greater than'
        input.value = 'Resin OS 1.6.0'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })
      it('should correctly test values using the "is less than" operator', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'is less than'
        input.value = 'Resin OS 1.7.5'

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 2'
        )
      })
    })

    /**
     * Simple text search
     */
    describe('Simple text search', () => {
      before(function () {
        this.schema = {
          version: {
            type: 'Semver'
          },
          description: {
            type: 'Text'
          },
          brief: {
            type: 'Short Text'
          },
          nullTest: {
            test: null
          }
        }
        this.collection = {
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
      })

      it('should correctly test values', function () {
        const input = {
          name: sieve.SIMPLE_SEARCH_NAME,
          value: 'Lorem'
        }

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 1',
          'Entry 3'
        )
      })

      it('should correctly stringify non-string values', function () {
        const input = {
          name: sieve.SIMPLE_SEARCH_NAME,
          value: '2'
        }

        expect(sieve.filter(this.collection, input)).to.have.all.keys(
          'Entry 2',
          'Entry 3'
        )
      })
    })

    describe('Filtering an array', () => {
      before(function () {
        this.schema = { test: { type: 'Short Text' } }
        this.collection = [
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
      })

      it('should return an array', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'contains'
        // Set a value
        input.value = 'abc'

        const result = sieve.filter(this.collection, input)
        expect(result).to.be.an('array')
      })

      it('should return the correct values', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const input = inputs.test

        input.operator = 'contains'
        // Set a value
        input.value = 'abc'

        const result = sieve.filter(this.collection, input)
        expect(result[0].test).to.equal(this.collection[0].test)
      })

      it('should allow an array of rules', function () {
        const inputs = sieve.makeFilterInputs(this.schema)
        const rules = [
          Object.assign({}, inputs.test, {
            operator: 'contains',
            value: 'de'
          }),
          Object.assign({}, inputs.test, {
            operator: 'contains',
            value: 'abc'
          })
        ]

        const result = sieve.filter(this.collection, rules)
        expect(result[0].test).to.equal(this.collection[0].test)
      })
    })

    it('should not throw if provided with an invalid data type in the rule', function () {
      const schema = { test: { type: 'Foo Bar' } }
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

      const inputs = sieve.makeFilterInputs(schema)
      const input = inputs.test

      input.operator = 'contains'
      input.value = 'abc'

      expect(() => sieve.filter(collection, input)).to.not.throw()
    })

    it('should not throw if provided with an invalid operator in the rule', function () {
      const schema = { test: { type: 'Short Text' } }
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

      const inputs = sieve.makeFilterInputs(schema)
      const input = inputs.test

      input.operator = 'foo bar'
      input.value = 'abc'

      expect(() => sieve.filter(collection, input)).to.not.throw()
    })

    it('should not restrict results if there is an invalid data type in the rule', function () {
      const schema = { test: { type: 'Foo Bar' } }
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

      const inputs = sieve.makeFilterInputs(schema)
      const input = inputs.test

      input.operator = 'contains'
      input.value = 'abc'

      expect(sieve.filter(collection, input)).to.have.length(2)
    })

    it('should not restrict results if there is an invalid operator in the rule', function () {
      const schema = { test: { type: 'Short Text' } }
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

      const inputs = sieve.makeFilterInputs(schema)
      const input = inputs.test

      input.operator = 'foo bar'
      input.value = 'abc'

      expect(sieve.filter(collection, input)).to.have.length(2)
    })

    it('should behave correctly when a rule references a non-existent schema field', function () {
      const schema = { test: { type: 'Short Text' } }
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

      const inputs = sieve.makeFilterInputs(schema)
      const input = inputs.test

      // Set the input name to something that doesn't exist in the schema
      input.name = 'foobar'

      input.operator = 'contains'
      input.value = 'abc'

      expect(sieve.filter(collection, input)).to.have.length(0)
    })

    /**
     * Additional rules
     */
    describe('Additional rules', () => {
      before(function () {
        this.schema = {
          version: {
            type: 'Semver'
          },
          description: {
            type: 'Text'
          },
          brief: {
            type: 'Short Text'
          },
          incidents: {
            type: 'Integer'
          }
        }
        this.collection = {
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
      })

      it('should correctly combine additional rules', function () {
        const filter = {
          name: 'incidents',
          type: 'Integer',
          operator: 'equals',
          value: 1,
          extra: {
            or: [{
              name: 'brief',
              type: 'Short Text',
              operator: 'contains',
              value: 'lorem'
            }]
          }
        }

        expect(sieve.filter(this.collection, filter)).to.have.all.keys(
          'Entry 1',
          'Entry 3'
        )
      })
    })
  })
})
