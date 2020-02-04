import * as React from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import styled from 'styled-components';
import { animations } from '../../animations';
import { DismissableContainer } from '../../internal/DismissableContainer';

export interface NotificationOptions {
	content: React.ReactNode;
	onDismiss?: () => void;
	id?: string | number;
	duration?: number;
	baselineHeight?: number;
}

const NOTIFICATION_WIDTH = 300;
const DEFAULT_NOTIFICATION_DURATION = 6000;

const FullWidthContainer = styled(DismissableContainer)`
	width: 100%;
`;

const enterExitAnimation = {
	duration: 200,
	timingFunction: 'linear',
	delay: 0,
};

const generateNotificationId = () => {
	return Math.random()
		.toString(36)
		.substr(2, 9);
};

const getTransformedOptions = (
	options: React.ReactNode | NotificationOptions,
): NotificationOptions => {
	const defaultOptions = {
		id: generateNotificationId(),
		duration: DEFAULT_NOTIFICATION_DURATION,
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

const NotificationContainer = ({
	children,
	baselineHeight,
	onDismiss,
	id,
}: any) => {
	return (
		<FullWidthContainer
			baselineHeight={baselineHeight}
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

export const NotificationsContainer = styled(ReactNotification)`
	/* This overrides the react-notification library's default container shadow */
	.notification-item {
		display: flex;
		position: relative;
		border-radius: 3px;
		margin-bottom: 15px;
		cursor: pointer;
		box-shadow: none;
	}

	width: 325px;
	right: 20px;
	top: 20px;
	position: absolute;
	pointer-events: all;

	${animations}
`;

export const notifications = {
	addNotification: (options: React.ReactNode | NotificationOptions) => {
		const transformedOptions = getTransformedOptions(options);

		store.addNotification({
			container: 'top-right',
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
					baselineHeight={transformedOptions.baselineHeight}
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
