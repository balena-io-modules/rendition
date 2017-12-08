import * as assign from 'lodash/assign'
import * as cloneDeep from 'lodash/cloneDeep'
import * as isArray from 'lodash/isArray'
import * as every from 'lodash/every'
import * as some from 'lodash/some'
import * as isObject from 'lodash/isObject'
import * as pickBy from 'lodash/pickBy'
import * as forEach from 'lodash/forEach'
import filterTests from '../PineTypes'

const SIMPLE_SEARCH_NAME = 'Full text search'

class SchemaSieve {
  constructor (tests = {}) {
    this.tests = assign(cloneDeep(filterTests), tests)

    this.SIMPLE_SEARCH_NAME = SIMPLE_SEARCH_NAME
  }

  test (item, input) {
    return isArray(input)
      ? every(input, i => this.baseTest(item, i))
      : this.baseTest(item, input)
  }

  baseTest (item, input) {
    const { type, name } = input

    // A simple search is not strictly a "type" and searches on all fields,
    // so we handle that seperately here
    if (name === SIMPLE_SEARCH_NAME) {
      const { value } = input
      return some(
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
    }

    // If the rule contains an unrecognised type or operator, then play it safe
    // and don't filter the item
    return true
  }

  filter (collection, input) {
    if (isArray(collection)) {
      return this.filterArray(collection, input)
    }
    if (isObject(collection)) {
      return this.filterObject(collection, input)
    }

    throw new Error('collection argument must be either object or array.')
  }

  filterArray (collection, input) {
    return collection.filter(item => this.test(item, input))
  }

  filterObject (collection, input) {
    return pickBy(collection, value => this.test(value, input))
  }

  getOperators (type) {
    if (type in filterTests) {
      return Object.keys(filterTests[type].rules)
    }
    return []
  }

  makeFilterInputs (schema) {
    const inputs = {}

    forEach(schema, (value, key) => {
      inputs[key] = {
        type: value.type,
        name: key,
        label: value.label,
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
