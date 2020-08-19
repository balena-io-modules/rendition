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
  onDismiss: action('Closed notification'),
  content: (
    <Box>
      <Txt mb={2}>Some text for the user to read</Txt>
      <Button>This is a button</Button>
    </Box>
  )
}

const textNotification = 'This is a notification'

const getContainerNotification = (container) => ({
  container,
  content: container
})

const getTypeNotification = (type) => ({
  type,
  content: type
})

const NotificationButton = ({ buttonText, notification }) => (
  <Button
    m={2}
    minWidth={150}
    onClick={() => notifications.addNotification(notification)}
    >
    {buttonText || notification.content}
  </Button>
)

const NotificationsStory = () => {
  React.useEffect(() => {
    notifications.addNotification(buttonNotification)
    notifications.addNotification(textNotification)
  }, [])

  return (
    <Flex flexDirection='column' p={3} alignItems='flex-start'>
      <NotificationsContainer />
      <NotificationButton
        buttonText='Add text notification'
        notification={textNotification}
      />
      <NotificationButton
        buttonText='Add button notification'
        notification={buttonNotification}
      />
    </Flex>
  )
}

const NotificationTypeStory = () => {
  const typeNotifications = ['danger', 'success', 'warning', 'info'].map(
    getTypeNotification
  )
  React.useEffect(() => {
    typeNotifications.forEach(notifications.addNotification)
  }, [])
  return (
    <Flex flexDirection='column' p={3} alignItems='flex-start'>
      <NotificationsContainer />
      {typeNotifications.map((typeNotification) => (
        <NotificationButton notification={typeNotification} />
      ))}
    </Flex>
  )
}

const NotificationPositionStory = () => {
  const containerNotifications = [
    'top-left',
    'top-center',
    'top-right',
    'center',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ].map(getContainerNotification)
  React.useEffect(() => {
    containerNotifications.forEach(notifications.addNotification)
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
          <NotificationButton notification={containerNotifications[0]} />
          <NotificationButton notification={containerNotifications[1]} />
          <NotificationButton notification={containerNotifications[2]} />
        </Flex>
        <NotificationButton notification={containerNotifications[3]} />
        <Flex>
          <NotificationButton notification={containerNotifications[4]} />
          <NotificationButton notification={containerNotifications[5]} />
          <NotificationButton notification={containerNotifications[6]} />
        </Flex>
      </Flex>
    </React.Fragment>
  )
}

storiesOf('Next/Notifications', module)
  .addDecorator(withReadme(Readme))
  // Wait until the startup notifications are added.
  .addDecorator(withScreenshot({ delay: 1500 }))
  .add('Standard', () => {
    // You cannot run hooks inside this function, so we define a separate React component.
    return <NotificationsStory />
  })
  .add('Type', () => {
    return <NotificationTypeStory />
  })
  .add('Position', () => {
    return <NotificationPositionStory />
  })
