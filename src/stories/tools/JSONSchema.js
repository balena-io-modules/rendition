import * as React from 'react'
import * as debounce from 'lodash/debounce'
import { storiesOf } from '@storybook/react'
import { Box, Flex, Text, Textarea } from '../../'
const Ajv = require('ajv')
const ajvKeywords = require('ajv-keywords')
const metaSchema6 = require('ajv/lib/refs/json-schema-draft-06.json')

const ajv = new Ajv()
ajvKeywords(ajv)
ajv.addMetaSchema(metaSchema6)

window.ajv = ajv

class Validator extends React.Component {
  constructor () {
    super()

    this.state = {
      data: '',
      schema: '',
      errors: null,
      valid: null
    }

    this.validate = debounce(() => {
      this.setState({ errors: null, valid: null })
      try {
        const schema = JSON.parse(this.state.schema)
        console.log('SCHEMA', schema)
        const data = JSON.parse(this.state.data)
        console.log('DATA', data)

        // Remove all schemas that may have been compiled already
        ajv.removeSchema(/^.*$/)

        const validate = ajv.compile(schema)
        const valid = validate(data)

        if (valid) {
          this.setState({ valid: true })
        } else {
          console.log(validate.errors)
          this.setState({ errors: validate.errors })
        }
      } catch (e) {
        console.error(e)
      }
    }, 700)
  }

  changeSchema (schema) {
    this.setState({ schema }, () => this.validate())
  }

  changeData (data) {
    this.setState({ data }, () => this.validate())
  }

  render () {
    return (
      <Box>
        <Flex p={3}>
          <Box p={2} flex='1'>
            <label>Schema</label>
            <Textarea
              monospace
              rows='10'
              onChange={e => this.changeSchema(e.target.value)}
              value={this.state.schema}
            />
          </Box>
          <Box p={2} flex='1'>
            <label>Data</label>
            <Textarea
              monospace
              rows='10'
              onChange={e => this.changeData(e.target.value)}
              value={this.state.data}
            />
          </Box>
        </Flex>
        {this.state.valid && <Text success>No errors found</Text>}
        {this.state.errors &&
          this.state.errors.map((err, index) => (
            <Text key={index} danger>
              <strong>{err.schemaPath}</strong>: {err.message}
            </Text>
          ))}
      </Box>
    )
  }
}

storiesOf('Tools/JSON Schema Validator', module).addWithInfo('Draft 6', () => {
  return <Validator />
})
