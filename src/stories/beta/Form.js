import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Txt } from '../../'
import { Form } from '../../unstable/'
import { Markdown } from '../../extra/Markdown'
import '../../extra/Form/mermaid'
import '../../extra/Form/markdown'
import * as Readme from '../README/Form.md'

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
      title: 'National Pokèdex Number',
      type: 'number'
    },
    caught: {
      type: 'boolean'
    },
    first_seen: {
      title: 'First seen',
      description: 'The first time you saw this pokèmon',
      type: 'string',
      format: 'date-time'
    },
    tags: {
      title: 'Tags',
      description: 'Add useful tags to your pokèmon',
      type: 'array',
      items: {
        type: 'string'
      }
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

storiesOf('Beta/Form', module)
  .addDecorator(withReadme(Readme))
  .add('Simple', () => {
    return <FormDemo schema={basicPokedexSchema} />
  })
  .add('Hidden submit button', () => {
    return <FormDemo schema={basicPokedexSchema} hideSubmitButton />
  })
  .add('Custom submit button text', () => {
    return <FormDemo schema={basicPokedexSchema} submitButtonText='Save' />
  })
  .add('UI schema', () => {
    return (
      <FormDemo
        schema={basicPokedexSchema}
        uiSchema={{
          'ui:order': ['Name', 'caught', 'Description', 'Abilities', '*']
        }}
      />
    )
  })
  .add('Preset values', () => {
    return (
      <FormDemo
        schema={basicPokedexSchema}
        value={{
          Name: 'Squirtle'
        }}
      />
    )
  })
  .add('Extra widgets', () => {
    const extraSchema = {
      type: 'object',
      properties: {
        Mermaid: {
          type: 'string',
          format: 'mermaid'
        },
        Markdown: {
          type: 'string',
          format: 'markdown'
        }
      }
    }
    return (
      <React.Fragment>
        <Box px={30} pt={30}>
          <Markdown>{extraWidgetsReadme}</Markdown>
        </Box>

        <FormDemo schema={extraSchema} />
      </React.Fragment>
    )
  })
