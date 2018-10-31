# BadgeSelect

Displays a dropdown list, with each item displayed as a `Badge` component.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/BadgeSelect.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `items`  | `string[]` | - | ✓ | An array of strings that should be rendered as `Badge`components |
| `extraPrefix`  | `string[]` | - | - | An array of strings that should be rendered in plaintext, before the main items |
| `extraSuffix`  | `string[]` | - | - | An array of strings that should be rendered in plaintext, after the main items |
| `onItemChange`  | `(value: string) => void` | - | - | A function that is called when an item is selected |
| `defaultSelected`| `string`| - | - | The item that should be selected by default |
| `placeholder`| `string`| - | - | The text to display if no item is selected by default |

Any other properties supplied are spread to the root element ([`DropDownButton`][1]).

## Inheritance

The properties of the [`DropDownButton`][1] component are also available.

[1]: /?selectedKind=DropDownButton
