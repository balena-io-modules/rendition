/* eslint-env mocha */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
global.document = (new JSDOM('')).window.document

import { PineTypes } from '../src'

/**
 * For some types, the correct normalization behaviour is to leave the value unmodified
 */
describe('PineTypes', () => {
  describe('normalize', () => {
    /**
     * Boolean
     */
    describe('Boolean', () => {
      it('should correctly normalize the boolean value `true`', () =>
        expect(PineTypes.Boolean.normalize(true)).to.be.true)
      it('should correctly normalize the boolean value `false`', () =>
        expect(PineTypes.Boolean.normalize(false)).to.be.false)
      it('should correctly normalize the string value `True`', () =>
        expect(PineTypes.Boolean.normalize('True')).to.be.true)
      it('should correctly normalize the string value `False`', () =>
        expect(PineTypes.Boolean.normalize('False')).to.be.false)
      it('should correctly normalize the string value `1`', () =>
        expect(PineTypes.Boolean.normalize('1')).to.be.true)
      it('should correctly normalize the string value `0`', () =>
        expect(PineTypes.Boolean.normalize('0')).to.be.false)
      it('should correctly normalize the string value `Yes`', () =>
        expect(PineTypes.Boolean.normalize('Yes')).to.be.true)
      it('should correctly normalize the string value `No`', () =>
        expect(PineTypes.Boolean.normalize('No')).to.be.false)
      it('should correctly normalize the number value `1`', () =>
        expect(PineTypes.Boolean.normalize(1)).to.be.true)
      it('should correctly normalize the number value `0`', () =>
        expect(PineTypes.Boolean.normalize(0)).to.be.false)
      it('should correctly normalize null values', () =>
        expect(PineTypes.Boolean.normalize(null)).to.be.false)
      it('should correctly normalize undefined values', () =>
        expect(PineTypes.Boolean.normalize(undefined)).to.be.false)
    })

    /**
     * Case Insensitive Text
     */
    describe('Case Insensitive Text', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes['Case Insensitive Text'].normalize(0)).to.equal('0')
        expect(
          PineTypes['Case Insensitive Text'].normalize(
            'lorem ipsum dolor sit amet'
          )
        ).to.equal('lorem ipsum dolor sit amet')
      })
      it('should correctly normalize null values', () =>
        expect(PineTypes['Case Insensitive Text'].normalize(null)).to.equal(''))
      it('should correctly normalize undefined values', () =>
        expect(
          PineTypes['Case Insensitive Text'].normalize(undefined)
        ).to.equal(''))
    })

    /**
     * Date
     */
    describe('Date', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes.Date.normalize(0)).to.equal(0)
      })
    })

    /**
     * Date Time
     */
    describe('Date Time', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes['Date Time'].normalize(0)).to.equal(0)
      })
    })

    /**
     * Enum
     */
    describe('Enum', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes.Enum.normalize(0)).to.equal(0)
      })
    })

    /**
     * Integer
     */
    describe('Integer', () => {
      it('should correctly normalize floating point values', () => {
        expect(PineTypes.Integer.normalize(1.2)).to.equal(1)
        expect(PineTypes.Integer.normalize(1.8)).to.equal(2)
      })

      it('should correctly normalize string values', () => {
        expect(PineTypes.Integer.normalize('1.2')).to.equal(1)
        expect(PineTypes.Integer.normalize('1.8')).to.equal(2)
        expect(PineTypes.Integer.normalize('foobar')).to.equal(0)
      })

      it('should correctly normalize null values', () =>
        expect(PineTypes.Integer.normalize(null)).to.equal(0))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes.Integer.normalize(undefined)).to.equal(0))
    })

    /**
     * Real
     */
    describe('Real', () => {
      it('should correctly normalize number values', () => {
        expect(PineTypes.Real.normalize(1.2)).to.equal(1.2)
        expect(PineTypes.Real.normalize(1.8)).to.equal(1.8)
      })

      it('should correctly normalize string values', () => {
        expect(PineTypes.Real.normalize('1.2')).to.equal(1.2)
        expect(PineTypes.Real.normalize('1.8')).to.equal(1.8)
        expect(PineTypes.Real.normalize('foobar')).to.equal(0)
      })

      it('should correctly normalize null values', () =>
        expect(PineTypes.Real.normalize(null)).to.equal(0))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes.Real.normalize(undefined)).to.equal(0))
    })

    /**
     * Semver
     */
    describe('Semver', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes.Semver.normalize(0)).to.equal('0')
      })
      it('should correctly normalize null values', () =>
        expect(PineTypes.Semver.normalize(null)).to.equal(''))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes.Semver.normalize(undefined)).to.equal(''))
    })

    /**
     * Semver Range
     */
    describe('Semver Range', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes['Semver Range'].normalize(0)).to.equal('0')
      })
      it('should correctly normalize null values', () =>
        expect(PineTypes['Semver Range'].normalize(null)).to.equal(''))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes['Semver Range'].normalize(undefined)).to.equal(''))
    })

    /**
     * Short Text
     */
    describe('Short Text', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes['Short Text'].normalize(0)).to.equal('0')
        expect(
          PineTypes['Short Text'].normalize('lorem ipsum dolor sit amet')
        ).to.equal('lorem ipsum dolor sit amet')
      })
      it('should correctly normalize null values', () =>
        expect(PineTypes['Short Text'].normalize(null)).to.equal(''))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes['Short Text'].normalize(undefined)).to.equal(''))
    })

    /**
     * Text
     */
    describe('Text', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes.Text.normalize(0)).to.equal('0')
        expect(PineTypes.Text.normalize('lorem ipsum dolor sit amet')).to.equal(
          'lorem ipsum dolor sit amet'
        )
      })
      it('should correctly normalize null values', () =>
        expect(PineTypes.Text.normalize(null)).to.equal(''))
      it('should correctly normalize undefined values', () =>
        expect(PineTypes.Text.normalize(undefined)).to.equal(''))
    })

    /**
     * Time
     */
    describe('Time', () => {
      it('should correctly normalize values', () => {
        expect(PineTypes.Time.normalize(0)).to.equal(0)
      })
    })
  })
})
