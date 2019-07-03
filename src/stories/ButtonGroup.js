import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import FaExpand from 'react-icons/lib/fa/expand'
import FaRecycle from 'react-icons/lib/fa/recycle'
import FaSpinner from 'react-icons/lib/fa/spinner'
import { Box, Button, ButtonGroup, Provider } from '../'
import Readme from './README/ButtonGroup.md'

storiesOf('Next/ButtonGroup', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <ButtonGroup>
            <Button>First</Button>
            <Button>Second</Button>
            <Button>Third</Button>
          </ButtonGroup>
          <ButtonGroup mt={3}>
            <Button icon={<FaExpand />} />
            <Button icon={<FaRecycle />} />
            <Button icon={<FaSpinner />} />
          </ButtonGroup>
        </Box>
      </Provider>
    )
  })
