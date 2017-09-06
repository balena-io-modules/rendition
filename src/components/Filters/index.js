import { h, Component } from 'preact'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import assign from 'lodash/assign'
import map from 'lodash/map'
import styled from 'styled-components'
import { FaFilter, FaSearch } from 'react-icons/lib/fa'
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
 * views - an object with two keys, 'global' and 'user', each of which contains an array of predefined filter views,
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

const FilterWrapper = styled(Box)`position: relative;`

const FilterInput = props => {
  const PineTypeInput = PineTypes[props.type].Edit
  console.log(PineTypes)
  console.log(props.type)

  return <PineTypeInput data={props.value} onChange={props.onChange} />
}

class Filters extends Component {
  constructor (props) {
    super(props)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleEditChange = this.handleEditChange.bind(this)
    this.generateFreshEdit = this.generateFreshEdit.bind(this)

    const { rules } = this.props
    const existingRule = find(rules, { name: sieve.SIMPLE_SEARCH_NAME })

    this.state = {
      showModal: false,
      edit: this.generateFreshEdit(),
      searchString: (existingRule && existingRule.value) || ''
    }
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

  generateFreshEdit () {
    if (!this.props.schema) {
      return {}
    }
    const inputModels = sieve.makeFilterInputs(this.props.schema)

    const edit = {
      name: Object.keys(inputModels).shift(),
      value: ''
    }

    edit.operator = inputModels[edit.name].availableOperators[0]

    return edit
  }

  addFilterRule (rule) {
    const { rules } = this.props
    rules.push(rule)
    this.props.setRules(rules)
  }

  editFilterRule (rule) {
    const { rules } = this.props
    const updatedRules = rules.map(r => (r.id === rule ? rule : r))

    this.props.setRules(updatedRules)
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

  toggleModal () {
    this.setState({ showModal: !this.state.showModal })
  }

  showEditModal (rule) {
    this.setState({
      showModal: true,
      edit: rule
    })
  }

  removeRule (rule) {
    if (rule.name === sieve.SIMPLE_SEARCH_NAME) {
      this.setState({ searchString: '' })
    }

    const { rules } = this.props

    const updatedRules = rules.filter(r => r.id !== rule.id)
    this.props.setRules(updatedRules)
  }

  handleEditChange (value, attribute) {
    const update = this.state.edit
    const inputModels = sieve.makeFilterInputs(this.props.schema)

    if (attribute === 'name' && update.name !== value) {
      update.name = value
      update.operator = inputModels[value].availableOperators[0]
      update.value = ''
    } else {
      update[attribute] = value
    }

    this.setState({ edit: update })
  }

  saveView (name, scope) {
    const { rules } = this.props
    let { views } = this.props

    const newView = {
      name,
      rules,
      id: utils.randomString(),
      scope
    }

    if (!views) {
      views = {}
    }

    if (scope === 'global') {
      if (!views.global) {
        views.global = []
      }
      views[scope].push(newView)
    } else {
      if (!views[scope]) {
        views[scope] = {}
      }
      if (!views[scope]) {
        views[scope] = []
      }
      views[scope].push(newView)
    }

    this.props.setViews(views)
  }

  deleteView (view) {
    const { views } = this.props

    if (view.scope === 'global') {
      views.global = views.global.filter(item => item.id !== view.id)
    } else {
      views[view.scope] = views[view.scope].filter(item => item.id !== view.id)
    }

    this.props.setViews(views)
  }

  render () {
    const inputModels = sieve.makeFilterInputs(this.props.schema)
    const rules = this.props.rules || []

    return (
      <FilterWrapper mb={3}>
        <Flex justify='space-between'>
          <Button primary onClick={() => this.toggleModal()}>
            <FaFilter style={{ marginRight: 10 }} />
            Add filter
          </Button>

          <SimpleSearchBox>
            <input
              placeholder='Search entries...'
              value={this.state.searchString}
              onChange={e => this.updateSimpleSearch(e.target.value)}
            />
            <FaSearch className='search-icon' name='search' />
          </SimpleSearchBox>

          <ViewsMenu
            rules={rules}
            views={this.props.views || []}
            setRules={this.props.setRules}
            deleteView={view => this.deleteView(view)}
          />
        </Flex>

        {this.state.showModal && (
          <div>
            <Modal
              title='Add a New Filter'
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
                      this.handleEditChange(e.target.value, 'name')}
                  >
                    {map(inputModels, ({ name }) => <option>{name}</option>)}
                  </Select>
                  <Select
                    mr={20}
                    value={this.state.edit.operator}
                    onChange={e =>
                      this.handleEditChange(e.target.value, 'operator')}
                  >
                    {map(
                      inputModels[this.state.edit.name].availableOperators,
                      name => <option>{name}</option>
                    )}
                  </Select>
                  <FilterInput
                    value={this.state.edit.value}
                    onChange={value => this.handleEditChange(value, 'value')}
                    type={inputModels[this.state.edit.name].type}
                  />
                </Flex>
              </form>
            </Modal>
          </div>
        )}

        {!!rules.length && (
          <FilterSummary
            edit={rule => this.showEditModal(rule)}
            delete={rule => this.removeRule(rule)}
            saveView={(name, scope) => this.saveView(name, scope)}
            rules={rules}
            views={this.props.views || {}}
          />
        )}
      </FilterWrapper>
    )
  }
}

export default Filters