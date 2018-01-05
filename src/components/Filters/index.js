import * as React from 'react'
import * as moment from 'moment'
import * as cloneDeep from 'lodash/cloneDeep'
import * as first from 'lodash/first'
import * as find from 'lodash/find'
import * as assign from 'lodash/assign'
import * as map from 'lodash/map'
import * as FaFilter from 'react-icons/lib/fa/filter'
import * as FaSearch from 'react-icons/lib/fa/search'
import styled from 'styled-components'
import FilterSummary from './Summary'
import ViewsMenu from './ViewsMenu'
import Button from '../Button'
import Modal from '../Modal'
import Select from '../Select'
import { Flex, Box } from '../Grid'
import * as utils from '../../utils'
import SchemaSieve from './SchemaSieve'
import PineTypes from '../PineTypes'

/**
 * The filter component requires the following props:
 * rules - an array of filter rule objects
 * schema - a SchemaSieve schema
 * views - an array of objects, each of which contains an array of predefined filter views,
 * setRules - a method that is called to set rules
 * setViews - a method that is called to set views
 */

const sieve = SchemaSieve()

const SimpleSearchBox = styled.div`
  position: relative;
  width: 500px;
  border-bottom: 2px solid #ccc;
  padding-left: 20px;
  padding-top: 3px;
  margin-left: 30px;
  margin-right: 30px;

  .search-icon {
    position: absolute;
    top: 7px;
    left: 0;
    color: #9b9b9b;
  }

  input {
    box-shadow: none;
    border: none;
    width: 100%;
    font-size: inherit;
    padding: 5px;
    ::placeholder {
      font-style: italic;
      color: #9b9b9b;
    }
  }
`

const FilterWrapper = styled(Box)`
  position: relative;
`

const FilterInput = props => {
  const PineTypeInput = PineTypes[props.type].Edit

  return (
    <PineTypeInput
      schema={props.schema}
      value={props.value}
      operator={props.operator}
      onChange={props.onChange}
    />
  )
}

class Filters extends React.Component {
  constructor (props) {
    super(props)
    this.handleEditChange = this.handleEditChange.bind(this)
    this.generateFreshEdit = this.generateFreshEdit.bind(this)

    const { rules } = this.props
    const existingRule = find(rules, { name: sieve.SIMPLE_SEARCH_NAME })

    this.state = {
      showModal: false,
      edit: this.generateFreshEdit(),
      searchString: (existingRule && existingRule.value) || ''
    }

    // Clean exsting rules on load
    this.filterAndSetRules(rules)
  }

  componentWillReceiveProps (nextProps) {
    const currentRules = nextProps.rules
    const existing = find(currentRules, { name: sieve.SIMPLE_SEARCH_NAME })
    if (existing) {
      const { value } = existing
      if (value !== this.state.searchString) {
        this.setState({ searchString: value })
      }
    } else {
      this.setState({ searchString: '' })
    }
  }

  /**
   * Remove filter rules that don't have a matching schema entry.
   * This can happen if the provided rules are from an old version of the
   * provided schema. Rather than making wrapper code handle this, we just clean
   * up rules as they are output from this component.
   */
  filterInvalidRules (rules) {
    return rules.filter(
      rule =>
        (rule.name === sieve.SIMPLE_SEARCH_NAME && rule.value) ||
        this.props.schema.hasOwnProperty(rule.name)
    )
  }

  filterAndSetRules (rules) {
    this.props.setRules(this.filterInvalidRules(rules))
  }

  generateFreshEdit () {
    if (!this.props.schema) {
      return {}
    }
    const inputModels = sieve.makeFilterInputs(this.props.schema)

    const edit = {
      name: Object.keys(inputModels).shift(),
      value: ''
    }

    edit.operator = inputModels[edit.name].availableOperators[0].value
    edit.label = inputModels[edit.name].label
    edit.type = inputModels[edit.name].type

    return this.setDefaultEditData(edit, edit.name)
  }

  addFilterRule (rule) {
    const { rules } = this.props
    rules.push(rule)
    this.filterAndSetRules(rules)
  }

  editFilterRule (rule) {
    const { rules } = this.props
    const updatedRules = rules.map(r => (r.id === rule.id ? rule : r))

    this.filterAndSetRules(updatedRules)
  }

  addRule (rule) {
    const inputModels = sieve.makeFilterInputs(this.props.schema)

    if (!rule) {
      rule = cloneDeep(this.state.edit)
    }
    const baseRule = inputModels[rule.name]
    const newRule = assign(cloneDeep(baseRule), rule)

    if (newRule.id) {
      this.editFilterRule(newRule)
    } else {
      newRule.id = utils.randomString()
      this.addFilterRule(newRule)
    }
    this.setState({
      showModal: false,
      edit: this.generateFreshEdit()
    })
  }

  updateSimpleSearch (val) {
    this.setState({ searchString: val })
    const { rules } = this.props
    const existingRule = find(rules, { name: sieve.SIMPLE_SEARCH_NAME })
    if (existingRule) {
      existingRule.value = val
      this.editFilterRule(existingRule)
    } else {
      this.addFilterRule({
        name: sieve.SIMPLE_SEARCH_NAME,
        value: val,
        id: utils.randomString()
      })
    }
  }

  showEditModal (rule) {
    this.setState({
      showModal: true,
      edit: cloneDeep(rule)
    })
  }

  removeRule (rule) {
    if (rule.name === sieve.SIMPLE_SEARCH_NAME) {
      this.setState({ searchString: '' })
    }

    const { rules } = this.props

    const updatedRules = rules.filter(r => r.id !== rule.id)
    this.filterAndSetRules(updatedRules)
  }

  setDefaultEditData (data, value) {
    const update = cloneDeep(data)
    const inputModels = sieve.makeFilterInputs(this.props.schema)
    const model = inputModels[value]
    update.type = model.type
    update.name = value
    update.operator = model.availableOperators[0].value
    update.label = model.label
    if (model.type === 'Date Time') {
      update.value = moment().format('YYYY-MM-DDTHH:mm')
    } else if (model.type === 'Date') {
      update.value = moment().format('YYYY-MM-DD')
    } else if (model.type === 'Time') {
      update.value = moment().format('HH:mm')
    } else if (model.type === 'Enum') {
      update.value = first(this.props.schema[model.name].values)
    } else {
      update.value = ''
    }

    return update
  }

  handleEditChange (value, attribute) {
    let update = this.state.edit

    if (attribute === 'name' && update.name !== value) {
      update = this.setDefaultEditData(update, value)
    } else if (attribute === 'operator') {
      update.value = null
      update[attribute] = value
    } else {
      update[attribute] = value
    }

    this.setState({ edit: update })
  }

  saveView (name, scopeKey) {
    const { rules } = this.props
    let { views } = this.props

    const newView = {
      name,
      rules: cloneDeep(rules),
      id: utils.randomString(),
      scopeKey
    }

    if (!views) {
      views = []
    }

    const store = views.find(item => item.key === scopeKey)

    store.data.push(newView)

    this.props.setViews(views)
  }

  deleteView (view, scopeKey) {
    const { views } = this.props

    const store = views.find(item => item.key === scopeKey)

    store.data = store.data.filter(v => v.id !== view.id)

    this.props.setViews(views)
  }

  showNewFilterModal () {
    this.setState({
      showModal: true,
      edit: this.generateFreshEdit()
    })
  }

  render () {
    const inputModels = sieve.makeFilterInputs(this.props.schema)
    const rules = this.props.rules || []

    return (
      <FilterWrapper mb={3}>
        <Flex justify='space-between'>
          <Button
            disabled={this.props.disabled}
            primary
            onClick={() => this.showNewFilterModal()}
            {...this.props.addFilterButtonProps}
          >
            <FaFilter style={{ marginRight: 10 }} />
            Add filter
          </Button>

          <SimpleSearchBox>
            <input
              disabled={this.props.disabled}
              placeholder='Search entries...'
              value={this.state.searchString}
              onChange={e => this.updateSimpleSearch(e.target.value)}
            />
            <FaSearch className='search-icon' name='search' />
          </SimpleSearchBox>

          <ViewsMenu
            buttonProps={this.props.viewsMenuButtonProps}
            disabled={this.props.disabled}
            rules={rules}
            views={this.props.views || []}
            schema={this.props.schema}
            setRules={rules => this.filterAndSetRules(rules)}
            deleteView={(view, scopeKey) => this.deleteView(view, scopeKey)}
          />
        </Flex>

        {this.state.showModal && (
          <div>
            <Modal
              title={
                this.state.edit.id
                  ? 'Update existing filter'
                  : 'Add a new filter'
              }
              cancel={() => this.setState({ showModal: false })}
              done={() => this.addRule()}
              action={this.state.edit.id ? 'Update filter' : 'Add filter'}
            >
              <form onSubmit={e => e.preventDefault() && this.addRule()}>
                <Flex>
                  <Select
                    mr={20}
                    value={this.state.edit.name}
                    onChange={e =>
                      this.handleEditChange(e.target.value, 'name')
                    }
                  >
                    {map(inputModels, ({ name, label }) => (
                      <option key={name} value={name}>
                        {label || name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    mr={20}
                    value={this.state.edit.operator}
                    onChange={e =>
                      this.handleEditChange(e.target.value, 'operator')
                    }
                  >
                    {map(
                      inputModels[this.state.edit.name].availableOperators,
                      ({ value, label }) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                  {inputModels[this.state.edit.name].type !== 'Boolean' && (
                    <FilterInput
                      operator={this.state.edit.operator}
                      schema={this.props.schema[this.state.edit.name]}
                      value={this.state.edit.value}
                      onChange={value => this.handleEditChange(value, 'value')}
                      type={inputModels[this.state.edit.name].type}
                    />
                  )}
                </Flex>
              </form>
            </Modal>
          </div>
        )}

        {!!rules.length &&
          !this.props.disabled && (
            <FilterSummary
              edit={rule => this.showEditModal(rule)}
              delete={rule => this.removeRule(rule)}
              saveView={(name, scope) => this.saveView(name, scope)}
              rules={rules}
              views={this.props.views || []}
              schema={this.props.schema}
            />
          )}
      </FilterWrapper>
    )
  }
}

export default Filters
