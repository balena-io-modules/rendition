import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Flex, Box, Spinner, Txt, Button } from '../../'
import Readme from './README.md'

storiesOf('Next/Spinner', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    const [showSpinner, setShowSpinner] = React.useState(true)

    return (
      <Box m={3}>
        <Flex m={3}>
          <Box m={3}>
            <Txt>Standard</Txt>
            <Spinner m={3} />
          </Box>
          <Box m={3}>
            <Txt>Emphasized</Txt>
            <Spinner emphasized m={3} />
          </Box>
          <Box m={3}>
            <Txt>Standard with label</Txt>
            <Spinner label='Loading...' m={3} />
          </Box>
          <Box m={3}>
            <Txt>Custom label component</Txt>
            <Spinner
              label={
                <Txt color='text.main'>
                  Building image <Button plain>12345</Button>...
                </Txt>
              }
              m={3}
            />
          </Box>
          <Box m={3}>
            <Txt>Emphasized with label</Txt>
            <Spinner label='Loading...' emphasized m={3} />
          </Box>
        </Flex>

        <Txt>With Children</Txt>

        <Button my={3} onClick={() => setShowSpinner((x) => !x)}>
          Toggle spinner
        </Button>
        <Spinner mb={3} show={false}>
          <Box p={5} style={{ backgroundColor: '#f8f9fd' }}>
            No active spinner (nothing to see here)
          </Box>
        </Spinner>

        <Spinner show={showSpinner} label='Loading...' emphasized>
          <Box p={5} style={{ backgroundColor: '#f8f9fd' }}>
            Spinning, the wrapped children are made opaque
          </Box>
        </Spinner>
      </Box>
    )
  })
