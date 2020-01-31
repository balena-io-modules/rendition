import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Badge, Box } from '../../'
import Readme from './README.md'

storiesOf('Next/Badge', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <React.Fragment>
        <Box m={3}>
          <Badge shade={0} mr={2}>
            Badge 0
          </Badge>
          <Badge shade={1} mr={2}>
            Badge 1
          </Badge>
          <Badge shade={2} mr={2}>
            Badge 2
          </Badge>
          <Badge shade={3} mr={2}>
            Badge 3
          </Badge>
        </Box>
        <Box m={3}>
          <Badge shade={4} mr={2}>
            Badge 4
          </Badge>
          <Badge shade={5} mr={2}>
            Badge 5
          </Badge>
          <Badge shade={6} mr={2}>
            Badge 6
          </Badge>
          <Badge shade={7} mr={2}>
            Badge 7
          </Badge>
        </Box>
        <Box m={3}>
          <Badge shade={8} mr={2}>
            Badge 8
          </Badge>
          <Badge shade={9} mr={2}>
            Badge 9
          </Badge>
          <Badge shade={10} mr={2}>
            Badge 10
          </Badge>
          <Badge shade={11} mr={2}>
            Badge 11
          </Badge>
        </Box>
        <Box m={3}>
          <Badge shade={12} mr={2}>
            Badge 12
          </Badge>
          <Badge shade={13} mr={2}>
            Badge 13
          </Badge>
          <Badge shade={14} mr={2}>
            Badge 14
          </Badge>
          <Badge shade={15} mr={2}>
            Badge 15
          </Badge>
        </Box>
        <Box m={3}>
          <Badge shade={16} mr={2}>
            Badge 16
          </Badge>
          <Badge shade={17} mr={2}>
            Badge 17
          </Badge>
          <Badge shade={18} mr={2}>
            Badge 18
          </Badge>
          <Badge shade={19} mr={2}>
            Badge 19
          </Badge>
        </Box>
        <Box m={3}>
          <Badge shade={20} mr={2}>
            Badge 20
          </Badge>
        </Box>
      </React.Fragment>
    )
  })
