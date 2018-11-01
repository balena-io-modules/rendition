import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Box, Img, Provider } from '../'
import * as Logo from './assets/etcher.svg'
import * as Readme from './README/Img.md'

storiesOf('Core/Img', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3} bg='#666'>
          <Img p={5} src={Logo} />
        </Box>
      </Provider>
    )
  })
