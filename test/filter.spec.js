/* eslint-env mocha */
import { expect } from 'chai'
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

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
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

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 2')
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

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
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
          'Entry 3'
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
          'Entry 4'
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
          'Entry 3'
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
          'Entry 4'
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

        expect(sieve.filter(this.collection, input)).to.have.all.keys('Entry 1')
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
    })
  })
})
