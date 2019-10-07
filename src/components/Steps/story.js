import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { faMapSigns } from '@fortawesome/free-solid-svg-icons/faMapSigns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withReadme from 'storybook-readme/with-readme'
import { withScreenshot } from 'storybook-chrome-screenshot'
import { Provider, Steps, Step } from '../../'
import Readme from './README.md'

storiesOf('Next/Steps', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withScreenshot())
  .add('Standard', () => {
    return (
      <Provider>
        <Steps m={3}>
          <Step status='completed'>These are</Step>
          <Step status='completed'>all completed</Step>
          <Step status='completed'>and not clickable</Step>
        </Steps>

        <Steps m={3}>
          <Step status='pending' onClick={() => null}>
            This one
          </Step>
          <Step status='completed' onClick={() => null}>
            Doesn't have
          </Step>
          <Step status='pending' onClick={() => null}>
            Title or dismiss button
          </Step>
          <Step status='none' onClick={() => null}>
            That's it (no icon)
          </Step>
        </Steps>

        <Steps
          m={3}
          titleIcon={<FontAwesomeIcon icon={faMapSigns} />}
          titleText={'Beginners Guide'}
          onClose={() => null}
        >
          <Step status='pending' onClick={() => null}>
            Do this
          </Step>
          <Step status='completed' onClick={() => null}>
            And then this
          </Step>
          <Step status='pending' onClick={() => null}>
            And finally this
          </Step>
        </Steps>
      </Provider>
    )
  })
