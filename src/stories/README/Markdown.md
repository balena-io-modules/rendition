# Markdown

A simple component for rendering [GitHub flavored markdown][1]. This component
sanitizes input.
This component is not loaded by default as it relies on a markdown parsing package 
that you may not want to include in your application.
You can load this component using:

```
import { Markdown } from 'rendition/dist/extra/Markdown';
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Markdown.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `children`  | `string` | - | ✓ | The markdown source that should be rendered |

Any other properties supplied are spread to the root element ([`Txt`][2]).

## Inheritance

The properties of the [`Txt`][2] component are also available.

[1]: https://github.github.com/gfm/
[2]: /?selectedKind=Txt
