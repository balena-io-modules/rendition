import * as React from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import styled from 'styled-components';
import { animations } from '../../animations';
import { Alert } from '../Alert';
import styles from './defaultStyle';

type CONTAINER =
	| 'top-left'
	| 'top-right'
	| 'top-center'
	| 'bottom-left'
	| 'bottom-right'
	| 'bottom-center';

type NOTIFICATION_TYPE = 'danger' | 'warning' | 'success' | 'info';

export interface NotificationOptions {
	/** The content you wish to display in the notification */
	content: React.ReactNode;
	/** A callback function that is triggered when the "dismiss" button is clicked */
	onDismiss?: () => void;
	/** A custom id for the notification */
	id?: string | number;
	/** The duration this notification will be shown for in ms. 0 means it will never close automatically */
	duration?: number;
	/** The position of the notifications in the parent container. One of `'top-left' */
	container?: CONTAINER;
	/** Optionally used to specify the intent of the notification. One of `'danger' */
	type?: NOTIFICATION_TYPE;
}

const NOTIFICATION_WIDTH = 300;
const DEFAULT_NOTIFICATION_DURATION = 6000;
const DEFAULT_NOTIFICATION_CONTAINER: CONTAINER = 'top-right';

const FullWidthContainer = styled(Alert)`
	width: 100%;
`;

const enterExitAnimation = {
	duration: 200,
	timingFunction: 'linear',
	delay: 0,
};

const generateNotificationId = () => {
	return Math.random().toString(36).substr(2, 9);
};

const getTransformedOptions = (
	options: React.ReactNode | NotificationOptions,
): NotificationOptions => {
	const defaultOptions = {
		id: generateNotificationId(),
		duration: DEFAULT_NOTIFICATION_DURATION,
		container: DEFAULT_NOTIFICATION_CONTAINER,
	};

	if (typeof options === 'string' || React.isValidElement(options)) {
		return {
			content: options,
			...defaultOptions,
		};
	} else {
		return {
			...defaultOptions,
			...(options as NotificationOptions),
		};
	}
};

type NotificationContainerProps = {
	children: React.ReactNode;
	type?: NotificationOptions['type'];
	onDismiss: NotificationOptions['onDismiss'];
	id: NotificationOptions['id'];
};

const NotificationContainer = ({
	children,
	type,
	onDismiss,
	id,
}: NotificationContainerProps) => {
	return (
		<FullWidthContainer
			emphasized={Boolean(type)}
			success={type === 'success'}
			danger={type === 'danger'}
			warning={type === 'warning'}
			info={type === 'info'}
			onDismiss={() => {
				if (onDismiss) {
					onDismiss();
				}
				store.removeNotification(id);
			}}
		>
			{children}
		</FullWidthContainer>
	);
};

/**
 * To use this component, you first need to add the `NotificationsContainer` component at the root of your React application.
 * You can then programatically add or remove notifications using the `notifications` module. For example:
 *
 * ```
 * import {notifications} from 'rendition';
 *
 * const notificationId = notifications.addNotification("Hi there");
 * notifications.removeNotification(notificationId);
 *
 * ```
 *
 * [View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Notifications/story.js)
 */
export const NotificationsContainer = styled(ReactNotification)`
	${animations}
	${styles}

	position: fixed;
	z-index: 9000;
	pointer-events: none;
	width: 100%;
	height: 100%;

	/* This overrides the react-notification library's default container shadow */
	.notification-item {
		box-shadow: none;
	}
`;

export const notifications = {
	addNotification: (options: React.ReactNode | NotificationOptions) => {
		const transformedOptions = getTransformedOptions(options);

		store.addNotification({
			container: transformedOptions.container,
			animationIn: ['animated', 'fadeIn', 'faster'],
			animationOut: ['animated', 'fadeOut', 'faster'],
			slidingEnter: enterExitAnimation,
			slidingExit: enterExitAnimation,
			touchRevert: enterExitAnimation,
			touchSlidingExit: {
				swipe: enterExitAnimation,
				fade: enterExitAnimation,
			},
			dismiss: {
				duration: transformedOptions.duration,
				pauseOnHover: true,
				waitForAnimation: false,
				click: false,
				touch: false,
			},
			width: NOTIFICATION_WIDTH,
			id: transformedOptions.id,
			content: (
				<NotificationContainer
					type={transformedOptions.type}
					onDismiss={transformedOptions.onDismiss}
					id={transformedOptions.id}
				>
					{transformedOptions.content}
				</NotificationContainer>
			),
		});
	},

	removeNotification: (id: string | number) => store.removeNotification(id),
};
