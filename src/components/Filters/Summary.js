import { h, Component } from 'preact'
import styled from 'styled-components'
import { Box, Flex } from '../Grid'
import Input from '../Input'
import Text from '../Text'
import Select from '../Select'
import { FaBookmarkO } from 'react-icons/lib/fa'
import Modal from '../Modal'
import FilterDescription from './FilterDescription'
import SchemaSieve from './SchemaSieve'

const sieve = SchemaSieve()

const BorderedDiv = styled.div`
  margin-top: 15px;
  padding: 6px 11px 0;
  border: solid 1px #979797;
`

const ActionBtn = styled.button`
  border: 0;
  background: none;
  padding: 0;
  font-size: 13px;
  float: right;
`

class FilterSummary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      showForm: false,
      id: '',
      option: 'new',
      scope: 'user'
    }
  }

  setExistingId (e) {
    const id = e.target.value
    this.setState({ id })
  }

  setViewScope (scope) {
    console.log('CHANGING SCOPE', scope)
    this.setState({ scope })
  }

  handleChange (e) {
    const name = e.target.value
    this.setState({ name })
  }

  save () {
    const { name, id, scope } = this.state

    if (!name && !id) {
      return
    }

    console.log(scope)

    this.props.saveView(name, scope)

    this.setState({
      name: '',
      showForm: false,
      id: ''
    })
  }

  render () {
    return (
      <BorderedDiv>
        <ActionBtn
          onClick={() => this.setState({ showForm: !this.state.showForm })}
        >
          <FaBookmarkO style={{ marginRight: 6 }} />
          Save view
        </ActionBtn>

        <Text fontSize={13} mb={10}>
          Filters ({this.props.rules.length})
        </Text>
        {this.state.showForm && (
          <Modal
            title='Save current view'
            cancel={() => this.setState({ showForm: false })}
            done={() => this.save()}
            action='Save'
          >
            <Flex mb={30}>
              <Text width={90}>Visible to:</Text>
              <Select
                mt={10}
                width={120}
                value={this.state.scope}
                onChange={e => this.setViewScope(e.target.value)}
              >
                <option value='user'>just me</option>
                <option value='global'>everyone</option>
              </Select>
            </Flex>

            <Input
              value={this.state.name}
              placeholder='Enter a name for the view'
              onChange={e => this.handleChange(e)}
            />
          </Modal>
        )}
        <Flex wrap>
          {this.props.rules.map(rule => (
            <Box mb={10} mr={10} key={rule.id}>
              <FilterDescription
                rule={rule}
                edit={
                  rule.name === sieve.SIMPLE_SEARCH_NAME ? (
                    false
                  )
                    : () => this.props.edit(rule)

                }
                delete={() => this.props.delete(rule)}
              />
            </Box>
          ))}
        </Flex>
      </BorderedDiv>
    )
  }
}

export default FilterSummary
