import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Flex, Provider, Txt } from '../../../'
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
      minLength: 5
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
  .addDecorator(withScreenshot())
  .add('Simple', () => {
    return (
      <Provider>
        <FormDemo schema={basicPokedexSchema} />
      </Provider>
    )
  })
  .add('Hidden submit button', () => {
    return (
      <Provider>
        <FormDemo schema={basicPokedexSchema} hideSubmitButton />
      </Provider>
    )
  })
  .add('Custom submit button text', () => {
    return (
      <Provider>
        <FormDemo schema={basicPokedexSchema} submitButtonText='Save' />
      </Provider>
    )
  })
  .add('UI schema', () => {
    const formData = {
      poke_password: 'Secret password'
    }

    return (
      <Provider>
        <FormDemo
          formData={formData}
          schema={basicPokedexSchema}
          uiSchema={{
            'ui:order': ['Name', 'caught', 'Description', 'Abilities', '*'],
            poke_password: {
              'ui:widget': 'password',
              'ui:options': {
                showPasswordStrengthMeter: true
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
      </Provider>
    )
  })
  .add('Preset values', () => {
    return (
      <Provider>
        <FormDemo
          schema={basicPokedexSchema}
          formData={{
            Name: 'Squirtle'
          }}
        />
      </Provider>
    )
  })
  .add('Warnings', () => {
    const uiSchema = {
      Name: {
        'ui:warning': 'Once the `Name` is set it cannot be changed'
      }
    }

    return (
      <Provider>
        <FormDemo schema={basicPokedexSchema} uiSchema={uiSchema} />
      </Provider>
    )
  })
  .add('Help Text', () => {
    const uiSchema = {
      Name: {
        'ui:help': 'Once the `Name` is set it cannot be changed'
      }
    }

    return (
      <Provider>
        <FormDemo schema={basicPokedexSchema} uiSchema={uiSchema} />
      </Provider>
    )
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

    return (
      <Provider>
        <FormDemo schema={schema} />
      </Provider>
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
        },
        Captcha: {
          type: 'string',
          format: 'captcha'
        }
      }
    }
    return (
      <Provider>
        <Box px={30} pt={30}>
          <Markdown>{extraWidgetsReadme}</Markdown>
        </Box>

        <FormDemo schema={extraSchema} />
      </Provider>
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

    return (
      <Provider>
        <FormDemo schema={patternPropertiesSchema} formData={formData} />
      </Provider>
    )
  })
