import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import { Box, Flex, Txt } from '../'
import { Form } from '../unstable/'

const basicPokedexSchema = {
  type: 'object',
  properties: {
    Name: {
      type: 'string'
    },
    Height: {
      type: 'number'
    },
    Weight: {
      type: 'number'
    },
    Description: {
      type: 'string'
    },
    Category: {
      type: 'string'
    },
    Abilities: {
      type: 'string'
    },
    pokedex_number: {
      title: 'National Pokedex Number',
      type: 'number'
    },
    caught: {
      type: 'boolean'
    },
    first_seen: {
      title: 'First seen',
      type: 'string',
      format: 'date-time'
    }
  }
}

class FormDemo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {}
    }
  }

  change ({ formData }) {
    action('Form.onChange')(formData)
    this.setState({ formData })
  }

  submit (data) {
    action('Form.onSubmit')(data)
  }

  render () {
    return (
      <Flex>
        <Box flex='1' m={30}>
          <Form
            onChange={d => this.change(d)}
            onSubmit={d => this.submit(d)}
            value={this.state.formData}
            {...this.props}
          />
        </Box>
        <Box flex='1' p={30}>
          <Txt monospace>
            <pre>{JSON.stringify(this.state.formData, null, 4)}</pre>
          </Txt>
        </Box>
      </Flex>
    )
  }
}

storiesOf('[beta] Form', module)
  .addWithInfo('Simple', () => {
    return <FormDemo schema={basicPokedexSchema} />
  })
  .addWithInfo('Hidden submit button', () => {
    return <FormDemo schema={basicPokedexSchema} hideSubmitButton />
  })
  .addWithInfo('Custom submit button text', () => {
    return <FormDemo schema={basicPokedexSchema} submitButtonText='Save' />
  })
  .addWithInfo('UI schema', () => {
    return (
      <FormDemo
        schema={basicPokedexSchema}
        uiSchema={{
          'ui:order': ['Name', 'caught', 'Description', 'Abilities', '*']
        }}
      />
    )
  })
  .addWithInfo('Preset values', () => {
    return (
      <FormDemo
        schema={basicPokedexSchema}
        value={{
          Name: 'Squirtle'
        }}
      />
    )
  })
