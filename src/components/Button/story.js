import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand'
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Txt } from '../../'
import Readme from './README.md'

storiesOf('Next/Button', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Box m={3}>
          <Txt>Standard</Txt>
          <Button m={2} primary onClick={action('case-1')}>
            Primary
          </Button>
          <Button m={2} secondary onClick={action('case-2')}>
            Secondary
          </Button>
          <Button m={2} success onClick={action('case-4')}>
            Success
          </Button>
          <Button m={2} warning onClick={action('case-4')}>
            Warning
          </Button>
          <Button m={2} info onClick={action('case-4')}>
            Info
          </Button>
          <Button m={2} danger onClick={action('case-5')}>
            Danger
          </Button>
          <Button m={2} onClick={action('case-7')}>
            Default
          </Button>
        </Box>
        <Box m={3}>
          <Txt>Standard</Txt>
          <Button m={2} disabled primary onClick={action('case-1')}>
            Primary
          </Button>
          <Button m={2} disabled secondary onClick={action('case-2')}>
            Secondary
          </Button>
          <Button m={2} disabled success onClick={action('case-4')}>
            Success
          </Button>
          <Button m={2} disabled warning onClick={action('case-4')}>
            Warning
          </Button>
          <Button m={2} disabled info onClick={action('case-4')}>
            Info
          </Button>
          <Button m={2} disabled danger onClick={action('case-5')}>
            Danger
          </Button>
          <Button m={2} disabled onClick={action('case-7')}>
            Default
          </Button>
        </Box>
      </Box>
    )
  })
