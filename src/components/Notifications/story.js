import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storycap'
import { NotificationsContainer, notifications, Box, Button, Txt } from '../../'
import Readme from './README.md'

const buttonNotification = {
  baselineHeight: 38,
  onDismiss: action('Closed notification'),
  content: (
    <Box>
      <Button>This is a button</Button>
      <Txt mt={2}>
        The dismiss button is alligned with the first component using the
        baseline prop
      </Txt>
    </Box>
  )
}

const textNotification = 'This is a notification'

const NotificationsStory = () => {
  React.useEffect(() => {
    notifications.addNotification(buttonNotification)
    notifications.addNotification(textNotification)
  }, [])

  return (
    <React.Fragment>
      <NotificationsContainer />
      <Box width={350} m={3}>
        <Button
          m={2}
          onClick={() => notifications.addNotification(textNotification)}
        >
          Add text notification
        </Button>

        <Button
          m={2}
          onClick={() => notifications.addNotification(buttonNotification)}
        >
          Add button notification
        </Button>
      </Box>
    </React.Fragment>
  )
}

storiesOf('Next/Notifications', module)
  .addDecorator(withReadme(Readme))
  // Wait until the startup notifications are added.
  .addDecorator(withScreenshot({ delay: 1000 }))
  .add('Standard', () => {
    // You cannot run hooks inside this function, so we define a separate React component.
    return <NotificationsStory />
  })
