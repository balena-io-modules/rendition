import React, { Component } from 'react'
import styled from 'styled-components'
import { Box, Flex } from '../Grid'
import Input from '../Input'
import Text from '../Text'
import Select from '../Select'
import FaBookmarkO from 'react-icons/lib/fa/bookmark'
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
      scope: props.views[0].key
    }
  }

  setExistingId (e) {
    const id = e.target.value
    this.setState({ id })
  }

  setViewScope (scope) {
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
            {this.props.views.length > 1 && (
              <Flex mb={30}>
                <Text width={90}>Visible to:</Text>
                <Select
                  ml={10}
                  mt='-7px'
                  width='auto'
                  value={this.state.scope}
                  onChange={e => this.setViewScope(e.target.value)}
                >
                  {this.props.views.map(item => (
                    <option key={item.key} value={item.key}>
                      {item.scopeLabel}
                    </option>
                  ))}
                </Select>
              </Flex>
            )}

            <Input
              width='100%'
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
                  rule.name === sieve.SIMPLE_SEARCH_NAME
                    ? false
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
