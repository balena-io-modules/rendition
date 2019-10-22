# MarkdownEditor

A markdown editor based on [simple MDE editor](https://github.com/RIP21/react-simplemde-editor)

```
import { MarkdownEditor } from 'rendition/dist/extra/MarkdownEditor';
```

[View story source](https://github.com/balena-io-modules/rendition/blob/master/src/extra/MarkdownEditor/story.js)

## Props

| Name   | Type   | Default   | Required   | Description   |
| ------ | ------ | --------- | ---------- | ------------- |
| `value`  | `string` | - | ✓ | The markdown-flavored text |
| `onChange`  | `(text: string) => void` | - | ✓ | Callback called on every content change |
