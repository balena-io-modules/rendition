import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import withReadme from 'storybook-readme/with-readme'
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand'
import { faRecycle } from '@fortawesome/free-solid-svg-icons/faRecycle'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button } from '../../'
import Readme from './README.md'

storiesOf('Next/Button', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <Button m={2} primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} quartenary onClick={action('case-3')}>
          Quartenary
        </Button>
        <Button m={2} success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} danger onClick={action('case-5')}>
          Danger
        </Button>
        <Box bg='lightgray' style={{ display: 'inline-block' }}>
          <Button m={2} light onClick={action('case-6')}>
            Light
          </Button>
        </Box>
        <Button m={2} onClick={action('case-7')}>
          Default
        </Button>
      </Box>
    )
  })
  .add('Disabled', () => {
    return (
      <Box m={3}>
        <Button m={2} disabled primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} disabled secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} disabled tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} disabled quartenary onClick={action('case-3')}>
          Quartenary
        </Button>
        <Button m={2} disabled success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} disabled danger onClick={action('case-5')}>
          Danger
        </Button>
        <Box bg='lightgray' style={{ display: 'inline-block' }}>
          <Button m={2} disabled light onClick={action('case-6')}>
            Light
          </Button>
        </Box>
        <Button m={2} disabled onClick={action('case-7')}>
          Default
        </Button>
      </Box>
    )
  })
  .add('Outline', () => {
    return (
      <Box m={3}>
        <Button m={2} outline primary onClick={action('case-1')}>
          Primary
        </Button>
        <Button m={2} outline secondary onClick={action('case-2')}>
          Secondary
        </Button>
        <Button m={2} outline tertiary onClick={action('case-3')}>
          Tertiary
        </Button>
        <Button m={2} outline quartenary onClick={action('case-3')}>
          Quartenary
        </Button>
        <Button m={2} outline success onClick={action('case-4')}>
          Success
        </Button>
        <Button m={2} outline danger onClick={action('case-5')}>
          Danger
        </Button>
        <Box bg='lightgray' style={{ display: 'inline-block' }}>
          <Button m={2} outline light onClick={action('case-6')}>
            Light
          </Button>
        </Box>
        <Button m={2} outline onClick={action('case-7')}>
          Default
        </Button>
      </Box>
    )
  })
  .add('Underline', () => {
    return (
      <Box m={3}>
        <Button m={2} primary underline onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} underline onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} underline disabled>
          Underline disabled
        </Button>
      </Box>
    )
  })
  .add('Plain', () => {
    return (
      <Box m={3}>
        <Button m={2} plain primary onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} plain color='green' onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} plain danger onClick={action('case-1')}>
          Button
        </Button>
        <Button m={2} plain danger disabled onClick={action('case-1')}>
          Button
        </Button>
        <Button
          m={2}
          plain
          primary
          icon={<FontAwesomeIcon icon={faSpinner} />}
          onClick={action('case-2')}
        >
          Button
        </Button>
      </Box>
    )
  })
  .add('Width', () => {
    return (
      <Box m={3}>
        <Button width={120} m={2} primary onClick={action('case-1')}>
          Button
        </Button>
        <Button width={180} m={2} secondary onClick={action('case-2')}>
          Button
        </Button>
        <Button width={240} m={2} tertiary onClick={action('case-3')}>
          Button
        </Button>
        <Button width={240} m={2} quartenary onClick={action('case-3')}>
          Button
        </Button>
        <div style={{ width: 300 }}>
          <Button fill m={2} onClick={action('case-4')}>
            Button
          </Button>
        </div>
      </Box>
    )
  })
  .add('With icon', () => {
    return (
      <Box m={3}>
        <Button
          m={2}
          tertiary
          icon={<FontAwesomeIcon icon={faExpand} />}
          onClick={action('case-3')}
        >
          Expand
        </Button>
        <Button
          m={2}
          icon={<FontAwesomeIcon icon={faRecycle} />}
          onClick={action('case-4')}
        >
          Recycle
        </Button>
      </Box>
    )
  })
  .add('Icon only', () => {
    return (
      <Box m={3}>
        <Button
          m={2}
          tertiary
          icon={<FontAwesomeIcon icon={faExpand} />}
          onClick={action('case-3')}
        />
        <Button
          m={2}
          onClick={action('case-4')}
          icon={<FontAwesomeIcon icon={faRecycle} />}
        />
      </Box>
    )
  })
  .add('Active', () => {
    return (
      <Box m={3}>
        <Box mb={2}>
          <Button m={2} outline>
            Outline
          </Button>
          <Button m={2} outline active>
            Outline active
          </Button>
        </Box>
        <Box mb={2}>
          <Button m={2} underline>
            Underline
          </Button>
          <Button m={2} underline active>
            Underline active
          </Button>
        </Box>
        <Box mb={2}>
          <Button m={2}>Default</Button>
          <Button m={2} active>
            Default active
          </Button>
        </Box>
        <Box mb={2}>
          <Button m={2} primary>
            Primary
          </Button>
          <Button m={2} primary active>
            Primary active
          </Button>
        </Box>
      </Box>
    )
  })
  .add('Link', () => {
    return (
      <React.Fragment>
        <Box m={3}>
          <Button m={2} href={`#`} primary>
            Primary
          </Button>
          <Button m={2} href={`#`} secondary>
            Secondary
          </Button>
          <Button m={2} href={`#`} tertiary>
            Tertiary
          </Button>
          <Button m={2} href={`#`} quartenary>
            Quartenary
          </Button>
          <Button m={2} href={`#`} success>
            Success
          </Button>
          <Button m={2} href={`#`} danger>
            Danger
          </Button>
          <Button m={2} href={`#`}>
            Default
          </Button>
        </Box>
        <Box m={3}>
          <Button m={2} underline href={`#`} primary>
            Link Button
          </Button>
          <Button m={2} underline href={`#`}>
            Link Button
          </Button>
        </Box>
      </React.Fragment>
    )
  })
  .add(
    'Confirmation',
    () => {
      return (
        <Box m={3}>
          <Button
            danger
            confirmation={{
              placement: 'bottom',
              text: 'Are you sure?'
            }}
            onClick={() => window.alert('confirmed')}
          >
            Dangerous action
          </Button>
        </Box>
      )
    },
    {
      screenshot: {
        skip: true
      }
    }
  )
