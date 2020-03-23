import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storycap'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Txt } from '../../../'
import { Form } from '../..'
import { Markdown } from '../../../extra/Markdown'
import { MermaidWidget } from '../../../extra/Form/mermaid'
import { MarkdownWidget } from '../../../extra/Form/markdown'
import { CaptchaWidget } from '../../../extra/Form/captcha'
import Readme from './README.md'

// Register the extra format widgets to the Form component
Form.registerWidget('markdown', MarkdownWidget)
Form.registerWidget('mermaid', MermaidWidget)
Form.registerWidget('captcha', CaptchaWidget)

// Any valid key would work in order to show the captcha in the story.
window.RECAPTCHA_V2_API_KEY = '6Ld-faYUAAAAAF92j1FX-GgG0uNPbw9sCCmnbJ2D'

import zxcvbn from 'zxcvbn'
window.zxcvbn = zxcvbn

const extraWidgetsReadme = `
# Extra widgets
Additional widgets for handling different formats can be registered using the \`Form.registerWidget\` method.
Rendition contains widgets for rendering Markdown and Mermaid text formats that can be used in the following way:
\`\`\`js
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Form } from 'rendition/dist/unstable/'
import { MermaidWidget } from 'rendition/dist/extra/Form/mermaid'
import { MarkdownWidget } from 'rendition/dist/extra/Form/markdown'

// Register the extra format widgets to the Form component
Form.registerWidget('markdown', MarkdownWidget)
Form.registerWidget('mermaid', MermaidWidget)

const schema = {
  type: 'object',
  properties: {
    Markdown: {
      format: 'markdown',
      type: 'string'
    },
    Mermaid: {
      format: 'mermaid',
      type: 'string'
    }
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Form schema={schema} />, rootElement)
\`\`\`
`

const basicPokedexSchema = {
  type: 'object',
  title: 'Pokèmon',
  properties: {
    Name: {
      type: 'string',
      minLength: 5,
      examples: ['Pikachu', 'Snorlax', 'Charmander', 'Bulbasaur']
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
      type: 'string',
      maxLength: 20
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
    poke_password: {
      title: 'Poke Password',
      description: "Password to access the pokèmon's abilities",
      type: 'string'
    },
    environment: {
      type: 'string',
      oneOf: [
        {
          const: 'earth',
          title: 'Earth'
        },
        {
          const: 'water',
          title: 'Water'
        },
        {
          const: 'fire',
          title: 'Fire'
        }
      ]
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
      formData: this.props.formData || {}
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
        <Box flex='1' maxWidth='50%' p={30}>
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
    const formData = {
      poke_password: 'Secret password'
    }

    return (
      <FormDemo
        formData={formData}
        schema={basicPokedexSchema}
        uiSchema={{
          'ui:order': ['Name', 'caught', 'Description', 'Abilities', '*'],
          Name: {
            'ui:autocomplete': 'on'
          },
          poke_password: {
            'ui:widget': 'password',
            'ui:options': {
              showPasswordStrengthMeter: true
            }
          },
          Height: {
            'ui:options': {
              emphasized: true
            }
          },
          environment: {
            'ui:options': {
              emphasized: true
            }
          },
          Description: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 5
            }
          }
        }}
      />
    )
  })
  .add('Preset values', () => {
    return (
      <FormDemo
        schema={basicPokedexSchema}
        formData={{
          Name: 'Squirtle'
        }}
      />
    )
  })
  .add('Warnings', () => {
    const uiSchema = {
      Name: {
        'ui:warning': 'Once the `Name` is set it cannot be changed'
      }
    }

    return <FormDemo schema={basicPokedexSchema} uiSchema={uiSchema} />
  })
  .add('Help Text', () => {
    const uiSchema = {
      Name: {
        'ui:help': 'Once the `Name` is set it cannot be changed'
      }
    }

    return <FormDemo schema={basicPokedexSchema} uiSchema={uiSchema} />
  })
  .add('Group titles', () => {
    const schema = {
      type: 'object',
      title: 'Networking',
      properties: {
        vpn: {
          type: 'object',
          title: 'Virtual Private Network',
          properties: {
            endpoint: {
              title: 'Endpoint',
              type: 'string'
            },
            certificate: {
              title: 'Certificate',
              type: 'string'
            }
          }
        },
        wifiNetwork: {
          type: 'object',
          title: 'WiFi Network',
          properties: {
            wifi: {
              type: 'object',
              properties: {
                ssid: {
                  title: 'Network SSID',
                  type: 'string'
                }
              }
            },
            wifiSecurity: {
              type: 'object',
              properties: {
                psk: {
                  title: 'Network Passphrase',
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }

    return <FormDemo schema={schema} />
  })
  // There is no good way to wait for the captcha. If this proves to be flaky, find a better solution
  .addDecorator(withScreenshot({ delay: 2000 }))
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
        },
        Captcha: {
          type: 'string',
          format: 'captcha'
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
  .add('patternProperties', () => {
    const patternPropertiesSchema = {
      type: 'object',
      properties: {
        dynamicObject: {
          patternProperties: {
            '^[0-9]+$': {
              title: 'Rule',
              type: 'string'
            }
          },
          title: 'Rules',
          type: 'object'
        }
      }
    }

    const formData = {
      dynamicObject: {
        '123': 'foo'
      }
    }

    return <FormDemo schema={patternPropertiesSchema} formData={formData} />
  })
  .add('Array of objects with dependants', () => {
    const enumValues = ['First', 'Second', 'Third']
    const schema = {
      type: 'object',
      properties: {
        application_config_variable: {
          title: 'Application configuration variables',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                title: 'Name',
                enum: enumValues
              }
            },
            dependencies: {
              name: {
                oneOf: enumValues.map(name => {
                  return {
                    description: 'Enter some value',
                    properties: {
                      name: {
                        enum: [name]
                      },
                      value: {
                        title: 'Value',
                        enum: ['false', 'true'],
                        default: 'true',
                        description: undefined
                      }
                    }
                  }
                })
              }
            }
          }
        },

        application_environment_variable: {
          type: 'array',
          title: 'Application environment variables',
          items: {
            type: 'object',
            properties: {
              name: {
                title: 'Name',
                type: 'string'
              },
              value: {
                title: 'Value',
                type: 'string'
              }
            }
          }
        }
      }
    }

    const formData = {
      application_config_variable: [{}],
      application_environment_variable: [{}]
    }

    return (
      <FormDemo
        schema={schema}
        uiSchema={{
          application_config_variable: {
            'ui:options': {
              orderable: false
            },
            items: {
              'ui:options': {
                responsive: true,
                flex: ['2 2 200px', '1 1 100px']
              }
            }
          },
          application_environment_variable: {
            'ui:options': {
              orderable: false
            },
            items: {
              'ui:options': {
                responsive: true,
                flex: ['2 2 200px', '1 1 100px']
              }
            }
          }
        }}
        formData={formData}
      />
    )
  })
