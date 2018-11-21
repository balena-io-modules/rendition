import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storybook-chrome-screenshot'
import withReadme from 'storybook-readme/with-readme'
import { Alert, Box, Provider } from '../'
import * as AlertReadme from './README/Alert.md'

storiesOf('Core/Alert', module)
  .addDecorator(withReadme(AlertReadme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Box m={3}>
          <Alert my={2} success onDismiss={action('case-3')}>
            This is a success message
          </Alert>
          <Alert my={2} danger onDismiss={action('case-1')}>
            This is an alert message
          </Alert>
          <Alert my={2} warning onDismiss={action('case-2')}>
            This is an alert message
          </Alert>
          <Alert my={2} info onDismiss={action('case-4')}>
            This is a general balena announcement
          </Alert>
        </Box>
      </Provider>
    )
  })
  .add('Emphasized', () => {
    return (
      <Provider>
        <Box m={3}>
          <Alert my={2} emphasized success onDismiss={action('case-3')}>
            This is a success message
          </Alert>
          <Alert my={2} emphasized danger onDismiss={action('case-1')}>
            This is an alert message
          </Alert>
          <Alert my={2} emphasized warning onDismiss={action('case-2')}>
            This is an alert message
          </Alert>
          <Alert my={2} emphasized info onDismiss={action('case-4')}>
            This is a general balena announcement
          </Alert>
        </Box>
      </Provider>
    )
  })
  .add('Plaintext', () => {
    return (
      <Provider>
        <Box m={3}>
          <Alert my={2} plaintext success>
            It's a success
          </Alert>
          <Alert my={2} plaintext info>
            General text goes here
          </Alert>
          <Alert my={2} plaintext danger>
            There was an error
          </Alert>
          <Alert my={2} plaintext warning>
            Warning text
          </Alert>
          <Alert my={2} plaintext success>
            <span>This is inline.</span>
            <span>{' As well as this.'}</span>
            <div>This is not</div>
          </Alert>
        </Box>
      </Provider>
    )
  })
