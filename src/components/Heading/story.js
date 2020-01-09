import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { Box, Heading, Provider } from '../../'
import Readme from './README.md'

storiesOf('Core/Heading', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Heading.h1>Heading h1</Heading.h1>
          <Heading.h2>Heading h2</Heading.h2>
          <Heading.h3>Heading h3</Heading.h3>
          <Heading.h4>Heading h4</Heading.h4>
          <Heading.h5>Heading h5</Heading.h5>
          <Heading.h6>Heading h6</Heading.h6>
        </Box>
      </Provider>
    )
  })
