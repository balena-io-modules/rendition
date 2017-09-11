/* eslint class-methods-use-this: 0 */
import _ from 'lodash'
import filterTests from '../PineTypes'

const SIMPLE_SEARCH_NAME = 'Full text search'

class SchemaSieve {
  constructor (tests = {}) {
    this.tests = _.assign(_.cloneDeep(filterTests), tests)

    this.SIMPLE_SEARCH_NAME = SIMPLE_SEARCH_NAME
  }

  baseTest (item, input) {
    const { type, name } = input

    // A simple search is not strictly a "type" and searches on all fields,
    // so we handle that seperately here
    if (name === SIMPLE_SEARCH_NAME) {
      const { value } = input
      return _.some(
        item,
        target =>
          target &&
          String(target)
            .toLowerCase()
            .includes(value.toLowerCase())
      )
    }

    if (type in filterTests) {
      const { operator, value } = input
      const target = item[name]

      if (operator in filterTests[type].rules) {
        return filterTests[type].rules[operator](target, value)
      }

      throw new Error(`${operator} is not a valid operator for ${type} types`)
    }
    throw new Error(`There is no filter test for type ${type}`)
  }

  filter (collection, input) {
    if (_.isObject(collection)) {
      return this.filterObject(collection, input)
    }
    if (_.isArray(collection)) {
      return this.filterArray(collection, input)
    }

    throw new Error('collection argument must be either object or array.')
  }

  filterArray (collection, input) {
    return collection.filter(item => this.baseTest(item, input))
  }

  filterObject (collection, input) {
    return _.pickBy(collection, value => this.baseTest(value, input))
  }

  getOperators (type) {
    if (type in filterTests) {
      return Object.keys(filterTests[type].rules)
    }
    return []
  }

  makeFilterInputs (schema) {
    const inputs = {}

    _.forEach(schema, (value, key) => {
      inputs[key] = {
        type: value.type,
        name: key,
        availableOperators: this.getOperators(value.type),
        operator: null,
        value: null
      }
    })

    return inputs
  }

  validate (type, value) {
    // If the type is unknown just return true
    if (!(type in filterTests)) {
      return true
    }

    return filterTests[type].validate(value)
  }

  getTypes () {
    return Object.keys(filterTests)
  }
}

export default tests => new SchemaSieve(tests)
