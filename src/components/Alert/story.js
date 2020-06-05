import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { Alert, Box, Link } from '../../'
import AlertReadme from './README.md'

storiesOf('Next/Alert', module)
  .addDecorator(withReadme(AlertReadme))
  .add('Standard', () => {
    return (
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
        <Alert my={2} info onDismiss={action('case-4')}>
          This is an a multi line text: Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. This is an a multi line
          text: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
          diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          erat, sed diam voluptua. This is an a multi line text: Lorem ipsum
          dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua.
        </Alert>
      </Box>
    )
  })
  .add('Emphasized', () => {
    return (
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
        <Alert my={2} emphasized info onDismiss={action('case-4')}>
          This is an a multi line text: Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. This is an a multi line
          text: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
          diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          erat, sed diam voluptua. This is an a multi line text: Lorem ipsum
          dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua.
        </Alert>
      </Box>
    )
  })
  .add('Plaintext', () => {
    return (
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
    )
  })
  .add('Variants', () => {
    return (
      <Box m={3}>
        <Alert my={2} success prefix={null}>
          Without a prefix
        </Alert>
        <Alert my={2} success>
          Without dismiss
        </Alert>
        <Alert my={2} warning>
          Custom prefix
        </Alert>
        <Alert
          my={2}
          warning
          prefix='Custom prefix!'
          onDismiss={action('case-5')}
        >
          With a link element <Link href='test'>link</Link>
        </Alert>
      </Box>
    )
  })
