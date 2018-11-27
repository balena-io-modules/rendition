# Rendition

[![npm version](https://badge.fury.io/js/rendition.svg)](http://badge.fury.io/js/rendition)
[![Build Status](https://travis-ci.org/balena-io-modules/rendition.svg?branch=master)](https://travis-ci.org/balena-io-modules/rendition)
[![Dependency Status](https://img.shields.io/david/balena-io-modules/rendition.svg)](https://david-dm.org/balena-io-modules/rendition)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

A library of UI components, built using [React][react], [recompose][recompose], [styled-components][styled-components] and [styled-system][styled-system].

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Components](#components)
* [Development](#development)
* [Testing](#testing)
* [Upgrading](#testing)

## Installation

```
npm install --save rendition
```

## Usage

Wrap your application in the `Provider` component and start using components!

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Box, Provider } from 'rendition';

ReactDOM.render(
  <Provider>
    <Box my={3} mx={['auto', 15]}>
      <Button primary emphasized>Click me</Button>
    </Box>
  </Provider>,
  document.getElementById('root')
);
```

## Components

For an interactive demo of all components, see https://balena-io-modules.github.io/rendition

- [Alert](#alert)
- [ArcSlider](#arcslider)
- [Badge](#badge)
- [BadgeSelect](#badgeselect)
- [Banner](#banner)
- [Box](#box)
- [Button](#button)
- [ButtonGroup](#buttongroup)
- [Card](#card)
- [CodeWithCopy](#codewithcopy)
- [Container](#container)
- [Divider](#divider)
- [DropDownButton](#dropdownbutton)
- [Filters](#filters)
- [Fixed](#fixed)
- [Flex](#flex)
- [Form](#form)
- [Gauge](#gauge)
- [Heading](#heading)
- [Img](#img)
- [Input](#input)
- [Link](#link)
- [Markdown](#markdown)
- [Mermaid](#mermaid)
- [Modal](#modal)
- [NavBar](#navbar)
- [Pager](#pager)
- [Pill](#pill)
- [ProgressBar](#progressbar)
- [Search](#search)
- [Select](#select)
- [Swatches](#swatches)
- [Table](#table)
- [Terminal](#terminal)
- [TextWithCopy](#textwithcopy)
- [Textarea](#textarea)
- [Tooltip](#tooltip)
- [Txt](#txt)

### Alert

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Alert.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | - | - | If true, use the `primary` theme color     |
| `secondary`   | `boolean` | - | - | If true, use the `secondary` theme color   |
| `tertiary`    | `boolean` | - | - | If true, use the `tertiary` theme color    |
| `quarternary` | `boolean` | - | - | If true, use the `quarternary` theme color |
| `danger`      | `boolean` | - | - | If true, use the `danger` theme color      |
| `warning`     | `boolean` | - | - | If true, use the `warning` theme color     |
| `success`     | `boolean` | - | - | If true, use the `success` theme color     |
| `info`        | `boolean` | - | - | If true, use the `info` theme color        |
| `emphasized`  | `boolean` | - | - | If true, use the use bolder colors and a larger size |
| `plaintText` | `boolean` | - | - | If true, the alert will be rendered without a border or a background |
| `prefix` | <code>JSX.Element &#124; string &#124; false</code> | - | - | Set a prefix on the alert message, if this prop is set to false, the default prefix will not be shown |
| `onDismiss` | `() => void` | - | - | A function that is called when dismissing an alert

### ArcSlider

A slider input that is displayed as an arc. This component will scale in size to
fit it's container. A label can be added by placing a child element inside this
component.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/ArcSlider.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                                   |
| --------------|-----------|-----------|------------|-------------------------------------------------------------- |
| `onValueChange`    | `(value: number) => void` | - | - | A function that is called when the slider value changes, this will always be a value between 0 and 1 |
| `value`       | `number`  | -         | -          | A number between 0 and 1 that represents the progress         |
| `fillColor`   | `string`  | -         | -          | A CSS color string to use for the color of the "filled" part of the arc |
| `background`  | `string`  | -         | -          | A CSS color string to use for the color of the arc track      |

#### Inheritance

The properties of the [`Box`][1] component are also available.

[1]: /?selectedKind=Box

### Badge

By default the background color of a `Badge` component is generated
automatically from its `text` property, though this can be overridden.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Badge.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | - | - | If true, use the `primary` theme color     |
| `secondary`   | `boolean` | - | - | If true, use the `secondary` theme color   |
| `tertiary`    | `boolean` | - | - | If true, use the `tertiary` theme color    |
| `quarternary` | `boolean` | - | - | If true, use the `quarternary` theme color |
| `danger`      | `boolean` | - | - | If true, use the `danger` theme color      |
| `warning`     | `boolean` | - | - | If true, use the `warning` theme color     |
| `success`     | `boolean` | - | - | If true, use the `success` theme color     |
| `info`        | `boolean` | - | - | If true, use the `info` theme color        |
| `text`  | `string` | - | ✓ | The text to display inside the badge |
| `small`  | `boolean` | - | - | If true, reduce the scale of the badge |

### BadgeSelect

Displays a dropdown list, with each item displayed as a `Badge` component.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/BadgeSelect.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `items`  | `string[]` | - | ✓ | An array of strings that should be rendered as `Badge`components |
| `extraPrefix`  | `string[]` | - | - | An array of strings that should be rendered in plaintext, before the main items |
| `extraSuffix`  | `string[]` | - | - | An array of strings that should be rendered in plaintext, after the main items |
| `onItemChange`  | `(value: string) => void` | - | - | A function that is called when an item is selected |
| `defaultSelected`| `string`| - | - | The item that should be selected by default |
| `placeholder`| `string`| - | - | The text to display if no item is selected by default |

Any other properties supplied are spread to the root element ([`DropDownButton`][1]).

#### Inheritance

The properties of the [`DropDownButton`][1] component are also available.

[1]: /?selectedKind=DropDownButton

### Banner

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Banner.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `backgroundImage`| `string`| - | - | The path to an image that should be displayed in the background |
| `minHeight`| `string`| - | - | The minimum height of the `Banner`, eg `180px` |


### Box

Displays a block level element.

The basic building block of a rendition application.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Box.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `flex`      | <code>string &#124; string[]</code> | - | - | Sets `flex`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `order`      | <code>number &#124; string &#124; Array&lt;number &#124; string&gt;</code> | - | - | Sets `order`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints


### Button

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Button.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | -         | -          | If true, use the `primary` theme color               |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color             |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color              |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color           |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color               |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color               |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                  |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `square`      | `boolean` | -         | -          | If true, render the button with equal length width and height |
| `disabled`      | `boolean` | -         | -          | If true, disabled the button |
| `outline`      | `boolean` | -         | -          | If true, the button will have a transparent background, and the border and text color will match |
| `plaintext`      | `boolean` | -         | -          | If true, render the button without padding, background or border |
| `underline`      | `boolean` | -         | -          | Similar to the `plaintext` prop, but displays a line underneath the button text |
| `iconElement`      | `JSX.Element` | -         | -          | Optionally provide a JSX element that will be rendered before the text inside the button |


### ButtonGroup

Wrapper for buttons to make them stick together.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/ButtonGroup.js)
### Card

Section containing content and actions on the same topic. 

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Card.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| -------|--------|-----------|------------|-------------- |
| `title`  | `string` | - | - | The title of the card |
| `cta`  | `JSX.Element` | - | - | React component added to the header |
| `rows`  | `JSX.Element[]` | - | - | Subsections separated by a horizontal separator |
| `minHeight`  | `string` | `auto` | - | CSS minHeight property |
| `children`  | `JSX.Element` | - | - | Any content that is internally wrapped in a Box |

### CodeWithCopy

Displays text formatted as `<code>` that can be copied to the clipboard.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/CodeWithCopy.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `text`      | `string` | -         | ✓          | The value that should be displayed, if the `copy` prop is not provided, this value will be copied to the clipboard
| `copy`      | `string` | -         | -          | The value that should be copied to the clipboard
| `showCopyButton`      | <code>'hover' &#124; 'always'</code> | <code>'always'</code>       | -          | Optionally show the copy button on hover or always show the button

### Container

A padded container with a responsive width.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Container.js)


### Divider

A styled horizontal rule.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Divider.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| -------|--------|-----------|------------|-------------- |
| `height`  | `number` | `2` | - | The height of the divider |
| `background-color`  | `string` | `#333` | - | The color of the divider |

### DropDownButton

Displays a button with an attached dropdown list, `children` of the component
are rendered inside a dropdown list.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/DropDownButton.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `primary`     | `boolean` | -         | -          | If true, use the `primary` theme color               |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color             |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color              |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color           |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color               |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color               |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                  |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `square`      | `boolean` | -         | -          | If true, render the button with equal length width and height |
| `disabled`      | `boolean` | -         | -          | If true, disabled the button |
| `label`      | `JSX.Element` | -         | -          | Optionally provide a JSX element that will be displayed inside the main button |
| `border`      | `boolean` | -         | -          | If true, place a border between each item in the dropdown |
| `joined`      | `boolean` | -         | -          | If true, render the component as a single button instead of two |
| `noListFormat`      | `boolean` | -         | -          | If true, render
children as a single JSX element instead of iterating over each of them |


### Filters

A component that can be used for generating filters in the form of [json schema](http://json-schema.org/) objects and saving sets of filters as "views".
The filters created by this component can be used to filter a collection of
objects using the `SchemaSieve` object.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Filters.js)

#### Schema

The `Filters` component requires a `schema` property which should be a json
schema that defines the shape of the objects you want to filter. For example if
you want to filter on a collection that looks like this:

```
[
  {
    name: 'Bulbasaur',
    caught: true,
  },
  {
    name: 'Pikachu',
    caught: true,
  },
  {
    name: 'Dratini',
    caught: false,
  }
]
```

You would define a schema that looks like this:

```
{
  type: 'object',
  properties: {
    name: {
      title: 'Name',
      type: 'string'
    },
    caught: {
      title: 'Has been caught',
      type: 'boolean'
    }
  }
}
```

If you provide a `title` property, it will be used to label the field when
filtering, otherwise the field name will be used.

##### Views

Views represent a set of filters, along with an id and a name. This is a useful
feature for storing a set filters and loading it again at a later point.
A view can optionally have a `scope` property, which will correspond to the
`slug` of a view scope, if you have provided one in the `Filters` property
`viewScopes` property. Scopes allow you to easily add an extra layer of
granularity/grouping to views that are generated. If you provide view scopes,
the user can select a scope when creating a new view.

A view scope has the following properties:

| Name          | Type      | Description                                          |
| ------------- | --------- | ---------------------------------------------------- |
| slug            | `string`  | A unique identifier for the scope                  |
| name          | `string`  | A descriptive name for the scope                     |
| label       | `string`  | An optional label to use for this scope when creating a view  |

A view has the following properties:

| Name          | Type      | Description                                          |
| ------------- | --------- | ---------------------------------------------------- |
| id            | `string`  | A unique identifier for the view                     |
| name          | `string`  | A descriptive name for the view                      |
| filters       | `string`  | An array of json schemas                             |
| scope       | <code>string &#124; null</code>  | The slug of a view scope, or `null` if now scopes are provided |

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `schema`    | `object` | - | ✓ | A json schema describing the shape of the objects you want to filter |
| `disabled`    | `boolean` | -         | -          | If true, disable the entire `Filters` interface
| `filters`    | `object[]` | -         | -          | An array of json schemas to be displayed as the currently selected filters, typically used when loading when loading filters from storage |
| `views`    | `object[]` | -         | -          | An array of views, as described above, typically used when loading when loading views from storage |
| `viewScopes`    | `object[]` | - | - | An array of view scopes, as described above |
| `onFiltersUpdate`    | `(filters: object[]) => void` | - | - | A function that is called when filters are updated |
| `onViewsUpdate`    | `(views: object[]) => void` | - | - | A function that is called when views are updated |
| `addFilterButtonProps` | `object` | - | - | Properties that are passed to the "Add filter" button, these are the same props used for the [`Button`][1] component |
| `viewsMenuButtonProps` | `object` | - | - | Properties that are passed to the "Views" button, these are the same props used for the [`DropDownButton`][2] component |
| `renderMode` | <code>string &#124; string[]</code> | - | - | Controls which parts of the `Filters` interface are displayed. One of `all`, `add`, `search`, `views`, `summary`, or an array containing any of these values |
| `dark`    | `boolean` | -         | -          | If true, Set the `Filters` component against a dark background |

[1]: /?selectedKind=Button
[2]: /?selectedKind=DropDownButton




### Fixed

Displays an element with a [`fixed`][1] position.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Fixed.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `top`      | <code>boolean &#124; ResponsiveStyle</code> | - | - | Sets the distance to the top of the containing block. If true, sets the value to zero
| `right`      | <code>boolean &#124; ResponsiveStyle</code> | - | - | Sets the distance to the right of the containing block. If true, sets the value to zero
| `bottom`      | <code>boolean &#124; ResponsiveStyle</code> | - | - | Sets the distance to the bottom of the containing block. If true, sets the value to zero
| `left`      | <code>boolean &#124; ResponsiveStyle</code> | - | - | Sets the distance to the left of the containing block. If true, sets the value to zero
| `z`      | `ResponsiveStyle` | - | - | Sets the z-index of the component |

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed

### Flex

Displays an element using [flexbox][1].

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Flex.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `align`      | <code>string &#124; string[]</code> | - | - | Sets `align-items`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `justify`      | <code>string &#124; string[]</code> | - | - | Sets `justify-content`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `flexDirection`      | <code>string &#124; string[]</code> | - | - | Sets `flex-direction`, if the value is an array, sets a responsive style corresponding to the theme's breakpoints
| `wrap`      | <code>string &#124; string[]</code> | - | - | Sets `flex-wrap: wrap`

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox

### Form

A component that can be used for generating a form from a [json schema](http://json-schema.org/) object. 
The standard json schema types are supported, as well as the `date-time` format.

Under the hood, this component uses [`react-jsonschema-form`][2] and support
all [`uiSchema`][3] options from that project.

Additional formats are supported, but require supporting widgets to be loaded.
For example if you would like to support the [mermaid][1] format, you'll need to
import the widget using `import 'renditon/dist/extra/Form/mermaid'`.
This import only needs to happen once, so it is recommended that its done at the
root level of your application.

This component is experimental and still under development, if you would like to
use it, it can be imported using `import { Form } from 'rendition/dist/unstable'`.

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `schema`    | `object` | - | ✓ | A json schema describing the shape of the data you would like to gather |
| `submitButtonText` | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to replace the text in the form submit button |
| `hideSubmitButton` | `boolean` | - | - | If true, do not display the form submit button |
| `submitButtonProps` | `object` | - | - | Properties that are passed to the submit button, these are the same props used for the [`Button`][4] component |
| `value` | `*` | - | - | The data that should be displayed in the form |
| `onFormChange` | `(result: object) => void` | - | - | A function that is called when form data changes |
| `onFormSubmit` | `(result: object) => void` | - | - | A function that is called when the form is submitted |
| `uiSchema` | `object` | - | - | A configuration object used to change the styling and layout of the form. See the [`react-jsonschema-form`][3] docs for more details |


[1]: https://mermaidjs.github.io/
[2]: https://github.com/mozilla-services/react-jsonschema-form
[3]: https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object
[4]: /?selectedKind=Button

### Gauge

Generate a "gauge" shaped chart with a color coded legend.
Gauges are generated using an array of data, where each item represents
a segment of the gauge. Each item should have the following properties:

| Name          | Type      | Description                                          |
| ------------- | --------- | ---------------------------------------------------- |
| value         | `number`  | A numerical value for this segment                   |
| name          | `string`  | A descriptive name for this segment                  |
| color         | `string`  | A CSS color string to use for this segment           |

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Gauge.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `title`  | `string` | - | ✓ | Text displayed in the center of the gauge |
| `data`  | `object[]` | - | ✓ | An array of data as described above |
| `placeholderColor`  | `string` | - | - | A CSS color string to use as the gauge background |


### Heading

A component that displays a heading. By default an `<h3>` tag is used. The exact
heading type can be specifed by appending the element name to the component, for
example `<Heading.h1>`, `<Heading.h2>`, `<Heading.h3>` etc.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Typography.js)

### Img

Displays an image.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Img.js)

#### Inheritance

The attributes of an [`<img>`][1] element are also available.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img

### Input

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Input.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `monospace`  | `boolean` | - | - | If true, render text in a monospace font |
| `onChange`  | `(e: Event) => void` | - | - | A function that is called when the input value changes |

#### Inheritance

The attributes of an [`<input>`][1] element are also available.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input



### Link

Displays an anchor link.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Typography.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `blank`  | `boolean` | - | - | If true, open the link in a new tab |
| `disabled`  | `boolean` | - | - | If true, disable the link |

#### Inheritance

The attributes of an [`<a>`][1] element are also available.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a


### Markdown

A simple component for rendering [GitHub flavored markdown][1]. This component
sanitizes input.
This component is not loaded by default as it relies on a markdown parsing package 
that you may not want to include in your application.
You can load this component using:

```
import { Markdown } from 'rendition/dist/extra/Markdown';
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Markdown.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `children`  | `string` | - | ✓ | The markdown source that should be rendered |

Any other properties supplied are spread to the root element ([`Txt`][2]).

#### Inheritance

The properties of the [`Txt`][2] component are also available.

[1]: https://github.github.com/gfm/
[2]: /?selectedKind=Txt

### Mermaid

Generate charts from text using [mermaidjs](https://mermaidjs.github.io/).
This component is not loaded by default as it relies on the mermaidjs library
that you may not want to include in your application.
You can load this component using:

```
import { Mermaid } from 'rendition/dist/extra/Mermaid';
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Mermaid.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `value`  | `string` | - | ✓ | The mermaid source that should be rendered |


### Modal

Displays a centrally position modal overlay. Children passed to this component
are rendered inside the modal.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Modal.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| --------------|-----------|-----------|------------|----------------------------------------------------- |
| `title`       | `string`
 | - | - | A title to display at the top of the Modal, only displayed if the `titleElement` property is not used |
| `titleElement`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display at the top of the modal |
| `titleDetails`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display underneath the modal's `title`, only displayed if the `titleElement` property is not used and a `title` property is provided |
| `action`    | <code>string &#124; JSX.Element</code> | - | - | A string or JSX element to display in the primary modal button, defaults to 'OK' |
| `cancel`    | `() => any` | - | - | A function that is called if the modal is dismissed |
| `done`    | `() => any` | - | ✓ | A function that is called if the primary modal button is clicked |
| `primaryButtonProps` | `object` | - | - | Properties that are passed to the primary button, these are the same props used for the [`Button`][1] component |
| `secondaryButtonProps` | `object` | - | - | If provided, will cause a secondary button to appear on the modal. These properties that are passed to that button, these are the same props used for the [`Button`][1] component |
| `cancelButtonProps` | `object` | - | - | Properties that are passed to the cancel button, these are the same props used for the [`Button`][1] component |
| `cancelButtonProps` | `object` | - | - | Properties that are passed to the cancel button, these are the same props used for the [`Button`][1] component |
| style | `object` | - | - |  Apply custom styles to Modal, the object is applied as a [`style` attribute][2] |
| containerStyle | `object` | - | - | Apply custom styles to the container of the Modal, the object is applied as a [`style` attribute][2] |

[1]: /?selectedKind=Button
[2]: https://reactjs.org/docs/dom-elements.html#style

### NavBar

A component used to render a navigation bar.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/NavBar.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `brand`    | `JSX.Element` | - | ✓ | A JSX element used as the main branding in the navbar |

### Pager

Displays a pager widget.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Pager.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `totalItems`  | `number`  | -         | -          | The total number of items to split into pages        |
| `itemsPerPage`| `number`  | -         | -          | The number of items on each page                     |
| `page`        | `number`  | -         | -          | The current page (zero-indexed)                      |
| `nextPage`    | `() => void` | -         | -          | Callback invoked when the "next page" button is clicked
| `prevPage`    | `() => void` | -         | -          | Callback invoked when the "previous page" button is clicked

### Pill

Displays a text block with rounded corners.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Pill.tsx)

#### Props

| Name          | Type                        | Default   | Required   | Description                                      |
| --------------|-----------------------------|-----------|------------|------------------------------------------------- |
| `primary`     | `boolean`                   | -         | -          | If true, use the `primary` theme color           |
| `secondary`   | `boolean`                   | -         | -          | If true, use the `secondary` theme color         |
| `tertiary`    | `boolean`                   | -         | -          | If true, use the `tertiary` theme color          |
| `quarternary` | `boolean`                   | -         | -          | If true, use the `quarternary` theme color       |
| `danger`      | `boolean`                   | -         | -          | If true, use the `danger` theme color            |
| `warning`     | `boolean`                   | -         | -          | If true, use the `warning` theme color           |
| `success`     | `boolean`                   | -         | -          | If true, use the `success` theme color           |
| `info`        | `boolean`                   | -         | -          | If true, use the `info` theme color              |
| `shade`       | `main` or `light` or `dark` | -         | -          | Can be set to use a variation of the theme color |
| `small`       | `boolean`                   | -         | -          | Scales down the badge                            |

### ProgressBar

Displays a progress bar using a value representing a percentage.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/ProgressBar.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                                   |
| --------------|-----------|-----------|------------|-------------------------------------------------------------- |
| `primary`     | `boolean` | `true`    | -          | If true, use the `primary` theme color                        |
| `secondary`   | `boolean` | -         | -          | If true, use the `secondary` theme color                      |
| `tertiary`    | `boolean` | -         | -          | If true, use the `tertiary` theme color                       |
| `quarternary` | `boolean` | -         | -          | If true, use the `quarternary` theme color                    |
| `danger`      | `boolean` | -         | -          | If true, use the `danger` theme color                         |
| `warning`     | `boolean` | -         | -          | If true, use the `warning` theme color                        |
| `success`     | `boolean` | -         | -          | If true, use the `success` theme color                        |
| `info`        | `boolean` | -         | -          | If true, use the `info` theme color                           |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                                    |
| `value`       | `number`  | -         | ✓          | A value between 1 and 100 that represents the progress        |
|  background   | `string`  | -         | -          | A CSS color string to use for the progress bar                |
|  color        | `string`  | -         | -          | A CSS color string to use for the content of the progress bar |

### Search

Displays an input styled as a search bar.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Search.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `dark`    | `boolean` | - | - | If true, uses a light colorscheme for use on a dark background |
| `disabled`    | `boolean` | -         | -          | If true, disable the input |
| `placeholder`    | `string` | -         | -          | A placeholder to use in the input |
| `value`    | `string` | -         | ✓          | The value of the input |
| `onChange`    | `(event: Event) => void` | -         | ✓          | A function that is called when the input changes |

### Select

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Select.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `emphasized`  | `boolean` | -         | -          | If true, use a larger size                           |
| `value`  | `string` | - | - | The selected value |
| `disabled`      | `boolean` | -         | -          | If true, disabled the element |
| `onChange`  | `(e: Event) => void` | - | - | A function that is called when the value changes |


### Swatches

This story displays the colors available in the `Theme` object exported from
`rendtion`. The values are also available to all styled components used within
the `Provider` component. See the [styled components documentation][1] for more
information

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Swatches.js)

[1]: https://www.styled-components.com/docs/advanced#theming

### Table

A component used to generate a styled table.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Table.js)

#### Columns

The `columns` property defines what columns the table should display, how they
are rendered and whether or not the column is sortable.

The `columns` property should be an array of objects with the following properties:

| Name          | Type      | Required | Description                                          |
| ------------- | --------- | -------- | ---------------------------------------------------- |
| field         | `keyof T`  | ✓ | The name of the field this column should render, this should correspond to a key on the objects passed to the `data` property of the `Table` component |
| cellAttributes | <code>object &#124; (value: any, row: T) => object</code> | - | Attributes that are passed to each cell in this column. This can also be a function, which will be called with the value of the `field` provided and the row data (`T`) |
| label | <code>string &#124; JSX.Element</code> | - | A string or JSX element that will be used to display the name of the column. If this property is not provided, the `field` property will be used instead |
| render | <code>(value: any, row: T) => string &#124; number &#124; number &#124; JSX.Element &#124; null</code> | - | Use a custom render function to display the value in each column cell. This function will be called with the value of the `field` provided and the row data (`T`) |
| sortable | <code>boolean &#124; (a: T, b: T) => number</code> | - | If true, the column will be sortable using an alphanumeric sort, alternatively a function can be provided allowing finer grained control over sorting |

#### Notes

For performance reasons table rows are only re-rendered if the row properties
have changed. For this reason, rows **will not** re-render if their properties
are mutated: you should clone the item instead, for example:

```js
update (index) {
  const newData = this.state.data
  const element = newData[index]
  newData[index] = Object.assign({}, element, { active: !element.active })
  this.setState({ data: newData })
}
```

See the **Updating data in a table** story for an example of how this can be
done using a high order component.

Additionally, because of this rendering behaviour the `render()` functions in
the `Table` component's `columns` property should only use values provided to 
the render function.
When `render()` functions are provided, they must act like pure functions with 
respect to their props. They should only rely on their arguments to generate 
their output and not use any context variables. If you are using a context 
variable in your `render()` function, then changes to that variable will not 
cause a re-render of the component and will not be reflected on the table.

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------------- | --------- | --------- | ---------- | ---------------------------------------------------- |
| `columns`    | `object[]` | - | ✓ | An array of column objects, as described above |
| `data`    | `T[]` | - | ✓ | An array of objects that will be displayed in the table |
| `getRowHref`    | `(row: T) => string` | - | - | If provided, each row in the table will be a clickable link, this function is used to create the link href |
| `onCheck`    | `(checkedItems: T[]) => string` | - | - | If provided, each row will begin with a checkbox. This function is called with every checked row every time a checkbox is toggled on or off. This property requires that you have provided a `rowKey` property |
| `onRowClick`    | `(row: T, event: Event) => void` | - | - | A function that is called when a row is clicked. This property requires that you have provided a `rowKey` property |
| `rowAnchorAttributes`    | `object` | - | - | Attributes to pass to the anchor element used in a row |
| `rowCheckboxAttributes`    | `object` | - | - | Attributes to pass to the checkbox element used in a row |
| `rowKey`    | `key of T` | - | - | A field on a row that contains a unique identifier, can help speed up render performance and is required for the `onCheck` property |
| `toBodyPrefix`    | <code>JSX.element &#124; JSX.Element</code> | - | - | JSX element(s) to display at the top of the table body |
| `highlightedRows`    | <code>&ast;[]</code> | - | - | Highlights one or more rows. This property requires that you have provided a `rowKey` property: the row with a `rowKey` property that matches one of these values is highlighted. 
| `usePager`    | `boolean` | - | - | If true, a pager will be used when displaying items. 
| `itemsPerPage`    | `number` | `50` | - | The number of items to be shown per page. Only used if `usePager` is true. Defaults to `50`.
| `pagerPosition`    | <code>'top' &#124; 'bottom' &#124; 'both'</code> | `top` | - | Sets wether the pager is displayed at the top of the table, the bottom of the table or in both positions. Only used if `usePager` is true. Defaults to `top`.

#### Programmatically selecting rows

The component has a `setRowSelection` method that can be accesssed via <a href='https://reactjs.org/docs/refs-and-the-dom.html' target='_blank' rel='noopener'>ref</a>.

It will accept an array of rows `T[]`, or an empty array in order to clear the selection.

This method requires that you have provided a `rowKey` property.

### Terminal

An xterm emulator built on top of [xterm.js][1].

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Terminal.js)

#### API

The `Terminal` component exposes a simple api, typically accessed via a `ref`.

Here is a simple example that writes a number every second:

```
import * as React from 'react'
import { Terminal } from 'rendition'

export class Logger extends React.Component {
  constructor (props) {
    super(props)

    this.count = 0
  }

  componentDidMount () {
    this.interval = setInterval(() => {
        this.term.writeln(++this.count)
      }
    }, 1000)
  }

  render () {
    return (
      <Terminal 
        ref={term => (this.term = term)} 
      />
    )
  }
}
```

##### `resize()`

Resize the `Terminal` component to fill its container.

##### `clear()`

Clear all output from the terminal.

##### `writeln(text)`

Write text to the terminal, followed by a line break.

##### `write(text)`

Write text to the terminal.

##### `destroy(text)`

Tear down the terminal instance.

#### Remounting old instances

If you'd like to preserve a terminal session and remount it to the DOM at
a later point, you will need to set the `persistent` property to `true` and then access the readonly property `tty` and store it in memory. 
The `persistent` flag prevents the `Terminal` component form destroying the
`tty` instance when it unmounts.
When you want to remount the session, instantiate a new `Terminal`
component and provide the `tty` value as the `ttyInstance` property. When
a `ttyInstance` property is provided, the `Terminal` component will use that
instance instead of creating a new one.

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `ttyInstance`    | `object` | -         | -          | An existing `Terminal.tty` instance to use instead of creating a new one |
| `persistent`    | `boolean` | -         | -          | If true, don't destroy the `Terminal.tty` instance when the component unmounts |
| `nonInteractive`    | `boolean` | -         | -          | If true, the component will go into a "read-only" state, useful for displaying logs |
| `color`    | `string` | -         | -          | A CSS color string that sets the background color of the terminal |
| `config`    | `object` | -         | -          | Startup options to pass to the tty instance, see the [xterm.js options][2] for more detail |



[1]: https://xtermjs.org/
[2]: https://github.com/xtermjs/xterm.js/blob/master/typings/xterm.d.ts#L24

### TextWithCopy

Displays text that can be copied to the clipboard.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/TextWithCopy.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `copy`      | `string` | -         | ✓          | The value that should be copied to the clipboard
| `showCopyButton`      | <code>'hover' &#124; 'always'</code> | - | - | Optionally show the copy button on hover or always show the button

### Textarea

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Textarea.js)

#### Props

| Name          | Type      | Default   | Required   | Description                                          |
| ------ | ------ | --------- | ---------- | ------------- |
| `monospace`  | `boolean` | `false` | - | If true, render text in a monospace font |
| `autoRows`  | `boolean` | `false` | - | If true, the textarea `rows` property will be changed automatically based on the content of the textarea, this behaviour will only work with a [controlled input][2] (i.e. you have used the `onChange` property |
| `minRows`  | `number` | - | - | Set the minimum number of rows |
| `maxRows`  | `number` | - | - | Set the maximum number of rows |
| `onChange`  | `(e: Event) => void` | - | - | A function that is called when the textarea value changes |

#### Inheritance

The attributes of a [`<textarea>`][1] element are also available.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
[2]: https://reactjs.org/docs/forms.html#controlled-components



### Tooltips

Tooltips can be added to a supported component using the `tooltip` attribute.
For example, to add a tooltip to a `Button` component you would do the
following:

```
<Button
  tooltip='I am a tooltip'
>
  Click me
</Button>
```

If the `tooltip` attribute is a string then a tooltip containing the strings
content will be displayed above the component.

If you need more control over the tooltip, you can set the attribute to an
object with the following properties:

| Name          | Type      | Required | Description                                          |
| ------------- | --------- | -------- | ---------------------------------------------------- |
| text         | `string`  | ✓ | The text to display in the tooltip |
| trigger | <code>'click' &#124; 'hover'</code> | - | Controls whether the tooltip is displayed on hover or click, defaults to `'hover'`
| placement | <code>'top' &#124; 'right' &#124; 'bottom' &#124; 'left'</code> | - | Controls the position of the tooltip related to the component, defaults to `'top'` |
| containerStyle | `object` | - | Apply custom styles to the tooltip outer container, the object is applied as a [`style` attribute][1] |
| innerStyle | `object` | - | Apply custom styles to the tooltip inner container, the object is applied as a [`style` attribute][1] |
| arrowStyle | `object` | - | Apply custom styles to the tooltip arrow, the object is applied as a [`style` attribute][1] |

The following rendition components support the `tooltip` attribute:

- `Alert`
- `Badge`
- `BadgeSelect`
- `Box`
- `Button`
- `CodeWithCopy`
- `DropDownButton`
- `Fixed`
- `Flex`
- `Heading`
- `Txt`
- `Link`

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Tooltip.js)

[1]: https://reactjs.org/docs/dom-elements.html#style

### Txt

Displays a text block. A `<span>` tag can be used with `<Txt.span>` and a `<p>`
tag can be used with `<Txt.p>`.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Typography.js)

#### Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `monospace`  | `boolean` | - | - | If true, render text in a monospace font |
| `bold`  | `boolean` | - | - | If true, render text in a bold font |
| `caps`  | `boolean` | - | - | If true, render text in uppercase |
| `align`  | `string` | - | - | Align text inside the component, one of 'left', 'right', 'center', 'justify', 'justify-all', 'start', 'end', 'match-parent', 'inherit', 'initial', 'unset' |
| `whitespace`  | `string` | - | - | Equivalent to the CSS `white-space` property, one of 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'initial', 'inherit' |



### Provider

Wrap your application in the `<Provider>` component so that child components can correctly inherit the default theme. You can optionally provide your own theme.

### Styled system

All components support [styled-system][styled-system] attributes, allowing you to use a shorthand properties for styling components. The properties can have the properties in the form of `string | number | Array<string | number>`. If an array is provided, then a property is chosen based on the width of the screen. The screen width corresponds to a breakpoint set in the `theme` property of the `Provider` component, by default this is set to `[32, 48, 64, 80]` where each number is the screen width in ems.

| Name          | Type              | Description                                  |
| --------------|-------------------|--------------------------------------------- |
|	w             | `ResponsiveStyle` | sets the width
|	fontSize      | `ResponsiveStyle` | sets the font size
|	color         | `ResponsiveStyle` | sets the `color` css property
|	bg            | `ResponsiveStyle` | sets the `background` css property
|	m             | `ResponsiveStyle` | sets the `margin` css property
|	mt            | `ResponsiveStyle` | sets the `margin-top` css property
|	mr            | `ResponsiveStyle` | sets the `margin-right` css property
|	mb            | `ResponsiveStyle` | sets the `margin-bottom` css property
|	ml            | `ResponsiveStyle` | sets the `margin-bottom` css property
|	mx            | `ResponsiveStyle` | sets both the `margin-right` and `margin-left` css properties
|	my            | `ResponsiveStyle` | sets both the `margin-top` and `margin-bottom` css properties
|	p             | `ResponsiveStyle` | sets the `padding` css property
|	pt            | `ResponsiveStyle` | sets the `padding-top` css property
|	pr            | `ResponsiveStyle` | sets the `padding-right` css property
|	pb            | `ResponsiveStyle` | sets the `padding-bottom` css property
|	pl            | `ResponsiveStyle` | sets the `padding-left` css property
|	px            | `ResponsiveStyle` | sets both the `padding-right` and `padding-left` css properties
|	py            | `ResponsiveStyle` | sets both the `padding-top` and `padding-bottom` css properties

&ast;*`ResponsiveStyle` corresponds to a type of `string | number | Array<string | number>`*

## Extra components

Some components in the [storybook](https://balena-io-modules.github.io/rendition)
are grouped separately under the `Extra` label. These components are not loaded by default 
as they rely on other large packages that you may not want to include in your 
application.
If you would like to use them they can be loaded using by prefixing the
component name with `rendition/dist/extra/`. For example to load the `Markdown`
components you can use:

```
import { Markdown } from 'rendition/dist/extra/Markdown';
```

## Unstable/Beta components

Some components in the [storybook](https://balena-io-modules.github.io/rendition)
are grouped seperately under the `Beta` label. These components are experimental and still
under development, as such their API may change without notice. They should not 
be used in a production application.
If you would like to try them out they can be loaded using
`import * from 'rendition/dist/unstable'`.

## Upgrading

[Upgrading from 3.x to 4.x](docs/migrating_3x-4x.md)

## Contributing

Please read our [contribution guidelines](docs/CONTRIBUTING.md)

[react]:https://reactjs.org/
[recompose]:https://github.com/acdlite/recompose
[styled-components]:https://www.styled-components.com/
[styled-system]:http://jxnblk.com/styled-system/
[husky]:https://github.com/typicode/husky
