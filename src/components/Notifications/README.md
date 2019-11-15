# Notifications

To use this component, you first need to add the `NotificationsContainer` component at the root of your React application.
You can then programatically add or remove notifications using the `notifications` module. For example:

```
import {notifications} from 'rendition';

const notificationId = notifications.addNotification("Hi there");
notifications.removeNotification(notificationId);
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/components/Notifications/story.js)

## Props

The `NotificationsContainer` component doesn't take any props. You do all customizations on a per-notification basis.
The `addNotification` function can take either a valid React node component, or the following options:

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `content`  | `React.ReactNode`  | -         | ✓          | The content you wish to display in the notification        |
| `duration`| `number`  | 6000         | -          | The duration this notification will be shown for in `ms`. `0` means it will never close automatically |
| `id`        | `number`  | (random)         | -          | A custom id for the notification                      |
| `baselineHeight`        | `number`  |  Normal text line height        | -          | The base height of the content, used to align the dismiss button correctly |
| `onDismiss`        | `() => void`  |         | -          | A callback function that is triggered when the "dismiss" button is clicked |