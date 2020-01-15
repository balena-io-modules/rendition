import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Badge, Box } from '../../'
import Readme from './README.md'

storiesOf('Core/Badge', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Badge mr={2}>Badge 1</Badge>
        <Badge mr={2}>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </Box>
    )
  })
  .add('Controlled', () => {
    return (
      <Box m={3}>
        <Badge primary mr={2}>
          Primary
        </Badge>
        <Badge secondary mr={2}>
          Secondary
        </Badge>
        <Badge tertiary mr={2}>
          Tertiary
        </Badge>
        <Badge quartenary mr={2}>
          Quartenary
        </Badge>
        <Badge bg='purple' color='green'>
          Custom
        </Badge>
      </Box>
    )
  })
  .add('Small', () => {
    return (
      <Box m={3}>
        <Badge small primary mr={2}>
          Primary
        </Badge>
        <Badge small secondary mr={2}>
          Secondary
        </Badge>
        <Badge small tertiary mr={2}>
          Tertiary
        </Badge>
        <Badge small quartenary mr={2}>
          Quartenary
        </Badge>
        <Badge small>Default</Badge>
      </Box>
    )
  })
  .add('Xsmall', () => {
    return (
      <Box m={3}>
        <Badge xsmall primary mr={2}>
          Primary
        </Badge>
        <Badge xsmall secondary mr={2}>
          Secondary
        </Badge>
        <Badge xsmall tertiary mr={2}>
          Tertiary
        </Badge>
        <Badge xsmall quartenary mr={2}>
          Quartenary
        </Badge>
        <Badge xsmall>Default</Badge>
      </Box>
    )
  })
