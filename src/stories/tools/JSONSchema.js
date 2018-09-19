import * as React from 'react'
import * as debounce from 'lodash/debounce'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Box, Flex, Provider, Txt, Textarea } from '../../'

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
      schemaError: null,
      errors: null,
      valid: null
    }

    this.validate = debounce(() => {
      this.setState({ errors: null, valid: null })
      try {
        const schema = JSON.parse(this.state.schema)
        // Remove all schemas that may have been compiled already
        ajv.removeSchema(/^.*$/)

        let validate

        try {
          validate = ajv.compile(schema)
          this.setState({ schemaError: null })
        } catch (e) {
          this.setState({ schemaError: e.message })

          return
        }

        const data = JSON.parse(this.state.data)

        const valid = validate(data)

        if (valid) {
          this.setState({ valid: true })
        } else {
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
            <label>JSON</label>
            <Textarea
              monospace
              rows='10'
              onChange={e => this.changeData(e.target.value)}
              value={this.state.data}
            />
          </Box>
        </Flex>

        {this.state.schemaError && (
          <Box p={3}>
            <Txt color='red'>{this.state.schemaError}</Txt>
          </Box>
        )}

        <Box p={3}>
          {this.state.valid && <Txt color='green'>No errors found</Txt>}
          {this.state.errors &&
            this.state.errors.map((err, index) => (
              <Txt key={index} color='red'>
                <strong>{err.schemaPath}</strong>: {err.message}
              </Txt>
            ))}
        </Box>
      </Box>
    )
  }
}

storiesOf('Tools/JSON Schema Validator', module)
  .addDecorator(withScreenshot())
  .add('Draft 6', () => {
    return (
      <Provider>
        <Validator />
      </Provider>
    )
  })
