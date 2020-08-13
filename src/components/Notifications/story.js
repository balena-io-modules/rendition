import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { action } from '@storybook/addon-actions'
import { withScreenshot } from 'storycap'
import {
  NotificationsContainer,
  notifications,
  Box,
  Flex,
  Button,
  Txt
} from '../../'
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

const containerNotification = (container) => ({
  container,
  duration: 0,
  content: container
})

const ContainerButton = ({ container }) => (
  <Button
    m={2}
    width={150}
    onClick={() =>
      notifications.addNotification(containerNotification(container))
    }
    >
    {container}
  </Button>
)

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

const NotificationPositionStory = () => {
  React.useEffect(() => {
    notifications.addNotification(containerNotification('top-left'))
    notifications.addNotification(containerNotification('top-center'))
    notifications.addNotification(containerNotification('top-right'))
    notifications.addNotification(containerNotification('center'))
    notifications.addNotification(containerNotification('bottom-left'))
    notifications.addNotification(containerNotification('bottom-center'))
    notifications.addNotification(containerNotification('bottom-right'))
  }, [])
  return (
    <React.Fragment>
      <NotificationsContainer />
      <Flex
        pt={6}
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Flex>
          <ContainerButton container='top-left' />
          <ContainerButton container='top-center' />
          <ContainerButton container='top-right' />
        </Flex>
        <ContainerButton container='center' />
        <Flex>
          <ContainerButton container='bottom-left' />
          <ContainerButton container='bottom-center' />
          <ContainerButton container='bottom-right' />
        </Flex>
      </Flex>
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
  .add('Position', () => {
    return <NotificationPositionStory />
  })
