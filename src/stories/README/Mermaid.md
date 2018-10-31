# Mermaid

Generate charts from text using [mermaidjs](https://mermaidjs.github.io/).
This component is not loaded by default as it relies on the mermaidjs library
that you may not want to include in your application.
You can load this component using:

```
import { Mermaid } from 'rendition/dist/extra/Mermaid';
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/stories/Mermaid.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `value`  | `string` | - | ✓ | The mermaid source that should be rendered |

