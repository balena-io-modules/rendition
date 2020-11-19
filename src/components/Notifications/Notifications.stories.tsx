import * as React from 'react';
import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Box, Flex, Button, Txt } from '../..';
import { notifications, NotificationsContainer } from '.';

const textNotification = 'This is a notification';

const getContainerNotification = (container: any) => ({
	container,
	content: container,
});

const getTypeNotification = (type: any) => ({
	type,
	duration: 0,
	content: type,
});

const NotificationButton = ({ buttonText, notification }: any) => (
	<Button
		m={2}
		minWidth={150}
		onClick={() => notifications.addNotification(notification)}
	>
		{buttonText || notification.content}
	</Button>
);

const NotificationsStory = () => {
	React.useEffect(() => {
		notifications.addNotification(buttonNotification);
		notifications.addNotification(textNotification);
	}, []);

	return (
		<Flex flexDirection="column" p={3} alignItems="flex-start">
			<NotificationsContainer />
			<NotificationButton
				buttonText="Add text notification"
				notification={textNotification}
			/>
			<NotificationButton
				buttonText="Add button notification"
				notification={buttonNotification}
			/>
		</Flex>
	);
};

const NotificationTypeStory = () => {
	const typeNotifications = ['danger', 'success', 'warning', 'info'].map(
		getTypeNotification,
	);
	React.useEffect(() => {
		typeNotifications.forEach(notifications.addNotification);
	}, []);
	return (
		<Flex flexDirection="column" p={3} alignItems="flex-start">
			<NotificationsContainer />
			{typeNotifications.map((typeNotification, index) => (
				<NotificationButton key={index} notification={typeNotification} />
			))}
		</Flex>
	);
};

const NotificationPositionStory = () => {
	const containerNotifications = [
		'top-left',
		'top-center',
		'top-right',
		'center',
		'bottom-left',
		'bottom-center',
		'bottom-right',
	].map(getContainerNotification);
	React.useEffect(() => {
		containerNotifications.forEach(notifications.addNotification);
	}, []);
	return (
		<React.Fragment>
			<NotificationsContainer />
			<Flex
				pt={6}
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
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
	);
};

const buttonNotification = {
	onDismiss: () => null,
	content: (
		<Box>
			<Txt mb={2}>Some text for the user to read</Txt>
			<Button>This is a button</Button>
		</Box>
	),
};

export default {
	title: 'Core/Notifications',
	component: NotificationsContainer,
} as Meta;

const Template = createTemplate<{}>(NotificationsStory);
export const Default = createStory<{}>(Template, {});

const TypeTemplate = createTemplate<{}>(NotificationTypeStory);
export const Types = createStory<{}>(TypeTemplate, {});

const PositionTemplate = createTemplate<{}>(NotificationPositionStory);
export const Positioning = createStory<{}>(PositionTemplate, {});
