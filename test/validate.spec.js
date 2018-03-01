/* eslint-env mocha */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
global.document = (new JSDOM('')).window.document

import { SchemaSieve } from '../src'

const sieve = SchemaSieve()

describe('pensieve validator', () => {
  describe('schemaValidate', () => {
    /**
     * Boolean
     */
    describe('Boolean field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Boolean', 1234)).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Boolean', false)).to.be.true)
    })

    /**
     * Case Insensitive Text
     */
    describe('Case Insensitive Text field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Case Insensitive Text', 1234)).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Case Insensitive Text', 'foobar')).to.be.true)
    })

    /**
     * Date Time
     */
    describe('Date Time field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Date Time', 'foobar')).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Date Time', '6 Mar 2017 21:22:23 GMT')).to.be
          .true)
    })

    /**
     * Date
     */
    describe('Date field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Date', 'foobar')).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Date', '6 Mar 2017 21:22:23 GMT')).to.be.true)
    })

    /**
     * Integer
     */
    describe('Integer field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Integer', 'foobar')).to.be.false)

      it('should return false when provided with a float value', () =>
        expect(sieve.validate('Integer', 1.234)).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Integer', 1234)).to.be.true)
    })

    /**
     * Real
     */
    describe('Real field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Real', 'foobar')).to.be.false)

      it('should return true when provided with an integer value', () =>
        expect(sieve.validate('Real', 1234)).to.be.true)

      it('should return true when provided with a float value', () =>
        expect(sieve.validate('Real', 1.234)).to.be.true)
    })

    /**
     * Short Text
     */
    describe('Short Text field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Short Text', 1234)).to.be.false)

      it('should return false when provided with a string value longer than 255 characters', () =>
        expect(sieve.validate('Short Text', Array(50).join('foobar'))).to.be
          .false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Short Text', 'foobar')).to.be.true)
    })

    /**
     * Text
     */
    describe('Text field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Text', 1234)).to.be.false)

      it('should return true when provided with a string value longer than 255 characters', () =>
        expect(sieve.validate('Text', Array(50).join('foobar'))).to.be.true)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Text', 'foobar')).to.be.true)
    })

    /**
     * Time
     */
    describe('Time field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Time', 'foobar')).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Time', '21:22:23 GMT')).to.be.true)
    })

    /**
     * Semver Range
     */
    describe('Semver Range field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Semver Range', 1234)).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Semver Range', '> 1.5.0')).to.be.true)
    })

    /**
     * Semver
     */
    describe('Semver field', () => {
      it('should return false when provided with an invalid value', () =>
        expect(sieve.validate('Semver', 1234)).to.be.false)

      it('should return true when provided with a valid value', () =>
        expect(sieve.validate('Semver', '1.5.0')).to.be.true)
    })
  })
})
