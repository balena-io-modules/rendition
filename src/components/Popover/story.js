import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Popover, Txt } from '../../'
import Readme from './README.md'

storiesOf('Next/Popover', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    const [target, setTarget] = React.useState(null)

    return (
      <Box m={3}>
        {target && (
          <Popover target={target} placement='right'>
            <Txt align='center' px={1}>
              Popover content
            </Txt>
          </Popover>
        )}
        <span ref={setTarget}>Popover target</span>
      </Box>
    )
  })
