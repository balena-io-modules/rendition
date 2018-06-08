import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import { Box, Flex, Txt } from '../../'
import { Form } from '../../unstable/'
import { Markdown } from '../../extra/Markdown'
import '../../extra/Form/mermaid'

const extraWidgetsReadme = `
# Extra widgets
Additional widgets for handling different formats can be loaded by importing
the relevant file from \`renditon/dist/extra/Form/\`.
`

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
          <Form
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
  .addWithInfo('Extra widgets', () => {
    const mermaidSchema = {
      type: 'object',
      properties: {
        Mermaid: {
          type: 'string',
          format: 'mermaid'
        }
      }
    }
    return (
      <React.Fragment>
        <Box px={30} pt={30}>
          <Markdown>{extraWidgetsReadme}</Markdown>
        </Box>

        <FormDemo schema={mermaidSchema} />
      </React.Fragment>
    )
  })
