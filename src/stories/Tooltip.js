import * as React from 'react'
import { storiesOf, action } from '@storybook/react'
import {
  Alert,
  Badge,
  BadgeSelect,
  Box,
  Button,
  CodeWithCopy,
  DeleteButton,
  DropDownButton,
  Fixed,
  Flex,
  Heading,
  Text,
  Link
} from '../'

storiesOf('Tooltip', module)
  .addDecorator(story => <Box m={4}>{story()}</Box>)
  .addWithInfo('Standard', () => {
    return (
      <Box>
        <Button
          tooltip='Tooltip on top'
          m={2}
          primary
          onPress={action('case-1')}
        >
          Tooltip on top
        </Button>
        <Button
          tooltip={{ text: 'Tooltip on right', placement: 'right' }}
          m={2}
          secondary
          onPress={action('case-2')}
        >
          Tooltip on right
        </Button>
        <Button
          tooltip={{ text: 'Tooltip on bottom', placement: 'bottom' }}
          m={2}
          success
          onPress={action('case-3')}
        >
          Tooltip on bottom
        </Button>
        <Button
          tooltip={{ text: 'Tooltip on left', placement: 'left' }}
          m={2}
          tertiary
          onPress={action('case-4')}
        >
          Tooltip on left
        </Button>
      </Box>
    )
  })
  .addWithInfo('Click', () => {
    return (
      <Box>
        <Button
          tooltip={{ text: 'Tooltip on top', trigger: 'click' }}
          m={2}
          primary
          onPress={action('case-1')}
        >
          Tooltip on top
        </Button>
        <Button
          tooltip={{
            text: 'Tooltip on right',
            trigger: 'click',
            placement: 'right'
          }}
          m={2}
          secondary
          onPress={action('case-2')}
        >
          Tooltip on right
        </Button>
        <Button
          tooltip={{
            text: 'Tooltip on bottom',
            trigger: 'click',
            placement: 'bottom'
          }}
          m={2}
          success
          onPress={action('case-3')}
        >
          Tooltip on bottom
        </Button>
        <Button
          tooltip={{
            text: 'Tooltip on left',
            trigger: 'click',
            placement: 'left'
          }}
          m={2}
          tertiary
          onPress={action('case-4')}
        >
          Tooltip on left
        </Button>
      </Box>
    )
  })
  .addWithInfo('Supported Elements', () => {
    return (
      <Box>
        <Heading.h3>Alert</Heading.h3>
        <Alert tooltip='Alert tooltip' warning>
          Lorem ipsum dolor sit amet.
        </Alert>

        <Heading.h3 mt={30}>Badge</Heading.h3>
        <Badge tooltip='Badge tooltip' text='lorem' />

        <Heading.h3 mt={30}>BadgeSelect</Heading.h3>
        <BadgeSelect
          tooltip='BadgeSelect tooltip'
          items={['wpe', 'web', 'redis']}
        />

        <Heading.h3 mt={30}>Box</Heading.h3>
        <Box tooltip='Box tooltip'>Lorem ipsum dolor sit amet.</Box>

        <Heading.h3 mt={30}>Button</Heading.h3>
        <Button tooltip='Button tooltip'>Lorem ipsum</Button>

        <Heading.h3 mt={30}>CodeWithCopy</Heading.h3>
        <CodeWithCopy text='Lorem' tooltip='CodeWithCopy tooltip' />

        <Heading.h3 mt={30}>DeleteButton</Heading.h3>
        <DeleteButton tooltip='DeleteButton tooltip' />

        <Heading.h3 mt={30}>DropDownButton</Heading.h3>
        <DropDownButton
          tooltip='DropDownButton tooltip'
          mx={2}
          primary
          label={<div>DropDown</div>}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </DropDownButton>

        <Fixed right='30px' tooltip='Fixed tooltip'>
          <Heading.h3 mt={30}>Fixed</Heading.h3>
        </Fixed>

        <Heading.h3 mt={30}>Flex</Heading.h3>
        <Flex style={{ height: 30 }} bg='red' tooltip='Flex tooltip' />

        <Heading.h3 mt={30}>Heading</Heading.h3>
        <Heading.h2 tooltip='Heading tooltip'>Hello world!</Heading.h2>

        <Heading.h3 mt={30}>Link</Heading.h3>
        <Link tooltip='Link tooltip'>Lorem ipsum dolor sit amet</Link>

        <Heading.h3 mt={30}>Text</Heading.h3>
        <Text tooltip='Text tooltip'>Lorem ipsum dolor sit amet</Text>
      </Box>
    )
  })
