# Markdown

A simple component for rendering [GitHub flavored markdown](https://github.github.com/gfm/). This component
sanitizes input.
This component is not loaded by default as it relies on a markdown parsing package
that you may not want to include in your application.
You can load this component using:

```
import { Markdown } from 'rendition/dist/extra/Markdown';
```

If you need to customize the conversion of markdown to HTML you can supply the `sanitizerOptions` prop. In this case, use the defaults as a starting point for your options:

```
import { Markdown, defaultSanitizerOptions } from 'rendition/dist/extra/Markdown';
```

Generated html inherits styles from rendition components. i.e an anchor will be
rendered as a `Link` component.

Html inside the markdown is sanitized and stripped of any inline js and css. so
they will always be rendered.

Components can be overridden by using `componentOverrides` prop.

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/extra/Markdown/story.js)

## Props

| Name                   | Type                                                                 | Default | Required | Description                                                                                                   |
| ---------------------- | -------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `children`             | `string`                                                             | -       | ✓        | The markdown source that should be rendered                                                                   |
| `sanitizerOptions`     | [`Object`](https://github.com/syntax-tree/hast-util-sanitize#schema) |         | -        | Specifies the options used when sanitizing the generated HTML. Passing `null` would disable the sanitization. |
| `componentOverrides`   | `Object`                                                             | -       | -        | Object specifying component Overrides. ex. `{ p: Txt.p }`                                                     |
| `decorators`           | `Object`                                                             | -       | -        | Decorate part of the text if it matches some condition                                                        |
| `disableRawHtml`       | `boolean`                                                            | false   | -        | when disabled it does not renders raw html in markdown                                                        |
| `disableCodeHighlight` | `boolean`                                                            | false   | -        | when disabled code blocks will not highlight syntax                                                           |

Any other properties supplied are spread to the root element ([`Txt`](#txt)).

## Inheritance

The properties of the [`Txt`](#txt) component are also available.
