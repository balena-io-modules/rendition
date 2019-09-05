import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box, Flex, Provider, Txt } from '../../../'

import { Async } from '../../'

const JellyForm = Async(() => {
  return import('.')
})

const schema = `
  title: Pokèmon
  version: 1
  properties:
    - Name:
        type: string
        minLength: 5
    - Category:
        type: string
        maxLength: 20
    - pokedex_number:
        title: National Pokèdex Number
        type: number
    - caught:
        type: boolean
    - first_seen:
        title: First seen
        description: The first time you saw this pokèmon
        type: string
        format: date-time
    - tags:
        title: Tags
        description: Add useful tags to your pokèmon
        type: array
        items:
          type: string
`

class FormDemo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      schema,
      formData: {}
    }

    this.change = ({ formData }) => {
      action('Form.onChange')(formData)
      this.setState({ formData })
    }

    this.submit = data => {
      action('Form.onSubmit')(data)
    }
  }

  render () {
    return (
      <Flex>
        <Box flex='1' m={30}>
          <JellyForm
            onFormChange={this.change}
            onFormSubmit={this.submit}
            value={this.state.formData}
            {...this.props}
          />
        </Box>
        <Box flex='1' style={{ maxWidth: '50%' }} p={30}>
          <Txt monospace>
            <pre>{JSON.stringify(this.state.formData, null, 4)}</pre>
          </Txt>
        </Box>
      </Flex>
    )
  }
}

storiesOf('Beta/JellyForm', module).add('Standard', () => {
  return (
    <Provider>
      <Box p={3}>
        <FormDemo schema={schema} />
      </Box>
    </Provider>
  )
})
